import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Resolver,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBookingFinalizeAction } from '../../models/ProposalBooking';
import {
  ScheduledEvent as ScheduledEventBase,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import {
  ScheduledEventResponseWrap,
  ScheduledEventsResponseWrap,
} from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class NewScheduledEventInput implements Partial<ScheduledEventBase> {
  @Field(() => ScheduledEventBookingType)
  bookingType: ScheduledEventBookingType;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Int)
  instrumentId: number;

  @Field(() => Int, { nullable: true })
  proposalBookingId?: number;
}

@InputType()
export class DeleteScheduledEventsInput {
  @Field(() => [Int])
  ids: number[];

  @Field(() => Int)
  proposalBookingId: number;

  @Field(() => Int)
  instrumentId: number;
}

@InputType()
export class UpdateScheduledEventInput {
  @Field(() => Int)
  scheduledEventId: number;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => Int, { nullable: true })
  localContact?: number;
}

@InputType()
export class ActivateScheduledEventInput {
  @Field(() => Int)
  id: number;
}

@InputType()
export class FinalizeScheduledEventInput {
  @Field(() => Int)
  id: number;

  @Field(() => ProposalBookingFinalizeAction)
  action: ProposalBookingFinalizeAction;
}

@Resolver()
export class ScheduledEventMutation {
  @Mutation(() => ScheduledEventResponseWrap)
  createScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('newScheduledEvent', () => NewScheduledEventInput)
    newScheduledEvent: NewScheduledEventInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.create(ctx, newScheduledEvent),
      ScheduledEventResponseWrap
    );
  }

  @Mutation(() => ScheduledEventsResponseWrap)
  deleteScheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg('deleteScheduledEventsInput', () => DeleteScheduledEventsInput)
    deleteScheduledEvents: DeleteScheduledEventsInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.delete(ctx, deleteScheduledEvents),
      ScheduledEventsResponseWrap
    );
  }

  @Mutation(() => ScheduledEventResponseWrap)
  updateScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('updateScheduledEvent', () => UpdateScheduledEventInput)
    updateScheduledEvent: UpdateScheduledEventInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.update(ctx, updateScheduledEvent),
      ScheduledEventResponseWrap
    );
  }

  @Mutation(() => ScheduledEventResponseWrap)
  activateScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('activateScheduledEvent', () => ActivateScheduledEventInput)
    activateScheduledEvent: ActivateScheduledEventInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.activate(ctx, activateScheduledEvent),
      ScheduledEventResponseWrap
    );
  }

  @Mutation(() => ScheduledEventResponseWrap)
  finalizeScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('finalizeScheduledEvent', () => FinalizeScheduledEventInput)
    finalizeScheduledEvent: FinalizeScheduledEventInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.finalize(ctx, finalizeScheduledEvent),
      ScheduledEventResponseWrap
    );
  }

  @Mutation(() => ScheduledEventResponseWrap)
  reopenScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => Int) id: number
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.reopen(ctx, { id }),
      ScheduledEventResponseWrap
    );
  }
}
