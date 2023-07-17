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
import { TzLessDateTime } from '../CustomScalars';
import { LostTimeResponseWrap } from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class SimpleLostTimeInput {
  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => Boolean, { nullable: true })
  newlyCreated?: boolean;

  @Field(() => Int, { nullable: true })
  scheduledEventId: number;
}

@InputType()
export class AddLostTimeInput {
  @Field(() => Int)
  proposalBookingId: number;

  @Field(() => SimpleLostTimeInput)
  lostTime: SimpleLostTimeInput;
}

@InputType()
export class UpdateLostTimeInput {
  @Field(() => Int)
  id: number;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;
}

@InputType()
export class DeleteLostTimeInput {
  @Field(() => Int)
  id: number;
}

@Resolver()
export class LostTimeMutation {
  @Mutation(() => LostTimeResponseWrap)
  addLostTime(
    @Ctx() ctx: ResolverContext,
    @Arg('addLostTimeInput', () => AddLostTimeInput)
    addLostTimeInput: AddLostTimeInput
  ) {
    return wrapResponse(
      ctx.mutations.lostTime.addLostTime(ctx, addLostTimeInput),
      LostTimeResponseWrap
    );
  }
  @Mutation(() => LostTimeResponseWrap)
  updateLostTime(
    @Ctx() ctx: ResolverContext,
    @Arg('updateLostTimeInput', () => UpdateLostTimeInput)
    updateLostTimeInput: UpdateLostTimeInput
  ) {
    return wrapResponse(
      ctx.mutations.lostTime.updateLostTime(ctx, updateLostTimeInput),
      LostTimeResponseWrap
    );
  }
  @Mutation(() => LostTimeResponseWrap)
  deleteLostTime(
    @Ctx() ctx: ResolverContext,
    @Arg('deleteLostTimeInput', () => DeleteLostTimeInput)
    deleteLostTimeInput: DeleteLostTimeInput
  ) {
    return wrapResponse(
      ctx.mutations.lostTime.deleteLostTime(ctx, deleteLostTimeInput),
      LostTimeResponseWrap
    );
  }
}
