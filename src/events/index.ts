import { proposalBookingDataSource, equipmentDataSource } from '../datasources';
import createEventHandlers from '../eventHandlers';
import { ApplicationEvent } from './applicationEvents';
import { EventBus } from './eventBus';

const eventHandlers = createEventHandlers({
  proposalBookingDataSource,
  equipmentDataSource,
});

export const eventBus = new EventBus<ApplicationEvent>(eventHandlers);
