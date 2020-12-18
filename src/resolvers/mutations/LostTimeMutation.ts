import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  Resolver,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { TzLessDateTime } from '../CustomScalars';
import { LostTimesResponseWrap } from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class SimpleLostTimeInput {
  @Field(() => ID)
  id: number;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => Boolean, { nullable: true })
  newlyCreated?: boolean;
}

@InputType()
export class BulkUpsertLostTimesInput {
  @Field(() => ID)
  proposalBookingId: number;

  @Field(() => [SimpleLostTimeInput])
  lostTimes: SimpleLostTimeInput[];
}

@Resolver()
export class LostTimeMutation {
  @Mutation(() => LostTimesResponseWrap)
  bulkUpsertLostTimes(
    @Ctx() ctx: ResolverContext,
    @Arg('bulkUpsertLostTimes', () => BulkUpsertLostTimesInput)
    bulkUpsertLostTimes: BulkUpsertLostTimesInput
  ) {
    return wrapResponse(
      ctx.mutations.lostTime.bulkUpsert(ctx, bulkUpsertLostTimes),
      LostTimesResponseWrap
    );
  }
}
