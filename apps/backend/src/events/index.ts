import { ApplicationEvent } from './applicationEvents';
import { EventBus } from './eventBus';
import { proposalBookingDataSource, equipmentDataSource } from '../datasources';
import createEventHandlers from '../eventHandlers';

const eventHandlers = createEventHandlers({
  proposalBookingDataSource,
  equipmentDataSource,
});

export const eventBus = new EventBus<ApplicationEvent>(eventHandlers);
