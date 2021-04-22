import { Field, ID, ObjectType } from 'type-graphql';

import { ScheduledEvent } from './ScheduledEvent';

@ObjectType()
export class EquipmentScheduledEvent extends ScheduledEvent {
  @Field(() => ID)
  equipmentId: number;
}
