import { proposalBookingDataSource } from '../datasources';
import createEventHandlers from '../eventHandlers';
import { ApplicationEvent } from './applicationEvents';
import { EventBus } from './eventBus';

const eventHandlers = createEventHandlers({
  proposalBookingDataSource,
});

export const eventBus = new EventBus<ApplicationEvent>(eventHandlers);

// process.exit(1);
