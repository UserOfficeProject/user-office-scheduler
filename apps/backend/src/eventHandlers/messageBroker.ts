import { logger } from '@user-office-software/duo-logger';
import {
  Queue,
  RabbitMQMessageBroker,
} from '@user-office-software/duo-message-broker';
import { DateTime } from 'luxon';

import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ApplicationEvent } from '../events/applicationEvents';
import { Event, Instrument } from '../generated/sdk';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { TZ_LESS_DATE_TIME } from '../resolvers/CustomScalars';

const PROPOSAL_SCHEDULING_QUEUE = process.env
  .PROPOSAL_SCHEDULING_QUEUE_NAME as Queue;

const EXCHANGE_NAME =
  process.env.SCHEDULER_EXCHANGE_NAME || 'user_office_scheduler_backend.fanout';

const createRabbitMQMessageBroker = async () => {
  try {
    const rabbitMQ = new RabbitMQMessageBroker();

    await rabbitMQ.setup({
      hostname: process.env.RABBITMQ_HOSTNAME,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    return rabbitMQ;
  } catch (error) {
    throw new Error(
      `Something went wrong while setting up the message broker: ${error}`
    );
  }
};

let rabbitMQCachedBroker: null | RabbitMQMessageBroker = null;

const getRabbitMQMessageBroker = async () => {
  if (rabbitMQCachedBroker === null) {
    rabbitMQCachedBroker = await createRabbitMQMessageBroker();
  }

  return rabbitMQCachedBroker;
};

export async function createListenToRabbitMQHandler({
  proposalBookingDataSource,
  equipmentDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
  equipmentDataSource: EquipmentDataSource;
}) {
  // don't try to initialize during testing
  // causes infinite loop
  if (process.env.UO_FEATURE_DISABLE_MESSAGE_BROKER === '1') {
    return async () => {
      // no op
    };
  }

  const CORE_EXCHANGE_NAME = process.env.CORE_EXCHANGE_NAME;

  if (!CORE_EXCHANGE_NAME) {
    throw new Error('CORE_EXCHANGE_NAME environment variable not set');
  }

  const rabbitMQ = await getRabbitMQMessageBroker();

  rabbitMQ.addQueueToExchangeBinding(
    PROPOSAL_SCHEDULING_QUEUE,
    CORE_EXCHANGE_NAME
  );

  rabbitMQ.listenOn(PROPOSAL_SCHEDULING_QUEUE, async (type, message) => {
    switch (type) {
      case Event.PROPOSAL_STATUS_CHANGED_BY_WORKFLOW:
      case Event.PROPOSAL_STATUS_CHANGED_BY_USER:
        logger.logDebug(
          `Listener on ${PROPOSAL_SCHEDULING_QUEUE}: Received event`,
          {
            type,
            message,
          }
        );
        await proposalBookingDataSource.upsert(message);

        return;

      case Event.PROPOSAL_DELETED:
        logger.logDebug(
          `Listener on ${PROPOSAL_SCHEDULING_QUEUE}: Received event`,
          {
            type,
            message,
          }
        );

        await proposalBookingDataSource.delete((message as any).proposalPk);

        return;
      case Event.INSTRUMENT_DELETED:
        logger.logDebug(
          `Listener on ${PROPOSAL_SCHEDULING_QUEUE}: Received event`,
          {
            type,
            message,
          }
        );

        await equipmentDataSource.deleteEquipmentInstruments([
          (message as Instrument).id,
        ]);

        return;
      default:
        // captured and logged by duo-message-broker
        // message forwarded to dead-letter queue (DL__PROPOSALS)
        throw 'Received unknown event';
    }
  });

  return async function messageBrokerHandler(event: ApplicationEvent) {
    switch (event.type) {
    }
  };
}

export async function createPostToRabbitMQHandler({
  proposalBookingDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
}) {
  // don't try to initialize during testing
  // causes infinite loop
  if (process.env.UO_FEATURE_DISABLE_MESSAGE_BROKER === '1') {
    return async () => {
      // no op
    };
  }

  const rabbitMQ = await getRabbitMQMessageBroker();

  return async function messageBrokerHandler(event: ApplicationEvent) {
    switch (event.type) {
      case Event.PROPOSAL_BOOKING_TIME_SLOT_ADDED: {
        const { scheduledevent } = event;

        if (!scheduledevent) {
          logger.logWarn('Scheduled event not found', {
            event,
          });

          return;
        }

        if (!scheduledevent.proposalBookingId) {
          logger.logWarn(
            `Scheduled event '${scheduledevent.id}' has no proposal booking`,
            {
              scheduledevent,
            }
          );

          return;
        }

        const proposalBooking = await proposalBookingDataSource.get(
          scheduledevent.proposalBookingId
        );

        if (!proposalBooking) {
          logger.logWarn(
            `Scheduled event '${scheduledevent.id}' has no proposal booking`,
            {
              scheduledevent,
            }
          );

          return;
        }

        const message = {
          id: scheduledevent.id,
          bookingType: scheduledevent.bookingType,
          startsAt: DateTime.fromJSDate(scheduledevent.startsAt).toFormat(
            TZ_LESS_DATE_TIME
          ),
          endsAt: DateTime.fromJSDate(scheduledevent.endsAt).toFormat(
            TZ_LESS_DATE_TIME
          ),
          proposalBookingId: scheduledevent.proposalBookingId,
          status: scheduledevent.status,
          proposalPk: proposalBooking?.proposal.primaryKey,
          localContactId: scheduledevent.localContact?.id ?? null,
        };

        const jsonMessage = JSON.stringify(message);

        await rabbitMQ.sendMessageToExchange(
          EXCHANGE_NAME,
          event.type,
          jsonMessage
        );

        logger.logDebug(
          'Proposal booking scheduled event successfully sent to the message broker',
          { eventType: event.type, jsonMessage }
        );

        return;
      }
      case Event.PROPOSAL_BOOKING_TIME_SLOTS_REMOVED:
        {
          const scheduledevents: ScheduledEvent[] = (event as any)[event.key];

          // NOTE: We check the first scheduled event because all of them have the same proposal booking id.
          if (!scheduledevents[0].proposalBookingId) {
            logger.logWarn(
              `Scheduled event '${scheduledevents[0].id}' has no proposal booking`,
              {
                scheduledevents,
              }
            );

            return;
          }

          const proposalBooking = await proposalBookingDataSource.get(
            scheduledevents[0].proposalBookingId
          );

          if (!proposalBooking) {
            logger.logWarn('Scheduled events have no proposal booking', {
              scheduledevents,
            });

            return;
          }

          const message = {
            scheduledevents: scheduledevents.map((scheduledEvent) => ({
              id: scheduledEvent.id,
              bookingType: scheduledEvent.bookingType,
              startsAt: scheduledEvent.startsAt,
              endsAt: scheduledEvent.endsAt,
              proposalBookingId: scheduledEvent.proposalBookingId,
              status: scheduledEvent.status,
              proposalPk: proposalBooking?.proposal.primaryKey,
              localContactId: scheduledEvent.localContact?.id ?? null,
            })),
          };

          const jsonMessage = JSON.stringify(message);

          await rabbitMQ.sendMessageToExchange(
            EXCHANGE_NAME,
            event.type,
            jsonMessage
          );

          logger.logDebug(
            'Proposal booking scheduled events removal successfully sent to the message broker',
            { eventType: event.type, jsonMessage }
          );
        }

        return;
      case Event.PROPOSAL_BOOKING_TIME_ACTIVATED:
      case Event.PROPOSAL_BOOKING_TIME_UPDATED:
      case Event.PROPOSAL_BOOKING_TIME_REOPENED:
      case Event.PROPOSAL_BOOKING_TIME_COMPLETED: {
        const { scheduledevent } = event;

        if (!scheduledevent) {
          logger.logWarn('Scheduled event not found', {
            event,
          });

          return;
        }

        if (!scheduledevent.proposalBookingId) {
          logger.logWarn(
            `Scheduled event '${scheduledevent.id}' has no proposal booking`,
            {
              scheduledevent,
            }
          );

          return;
        }

        const proposalBooking = await proposalBookingDataSource.get(
          scheduledevent.proposalBookingId
        );

        if (!proposalBooking) {
          logger.logWarn('Proposal booking not found', {
            scheduledevent,
          });

          return;
        }

        const message = {
          id: scheduledevent.id,
          proposalBookingId: scheduledevent.proposalBookingId,
          proposalPk: proposalBooking.proposal.primaryKey,
          startsAt: DateTime.fromJSDate(scheduledevent.startsAt).toFormat(
            TZ_LESS_DATE_TIME
          ),
          endsAt: DateTime.fromJSDate(scheduledevent.endsAt).toFormat(
            TZ_LESS_DATE_TIME
          ),
          status: scheduledevent.status,
          localContactId: scheduledevent.localContact?.id ?? null,
        };

        const jsonMessage = JSON.stringify(message);

        await rabbitMQ.sendMessageToExchange(
          EXCHANGE_NAME,
          event.type,
          jsonMessage
        );

        logger.logDebug(
          'Proposal booking scheduled event successfully sent to the message broker',
          { eventType: event.type, jsonMessage }
        );

        return;
      }
      default:
        // captured and logged by duo-message-broker
        // message forwarded to dead-letter queue (DL__SCHEDULED_EVENTS)
        throw 'Received unknown event';
    }
  };
}
