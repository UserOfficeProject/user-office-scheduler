import { Type } from 'class-transformer';
import { Field, ID, Int, ObjectType } from 'type-graphql';

import {
  ProposalBooking as ProposalBookingBase,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
import { Call } from './Call';
import { Instrument } from './Instrument';
import { Proposal } from './Proposal';

@ObjectType()
export class ProposalBooking implements Partial<ProposalBookingBase> {
  @Field(() => ID)
  public id: number;

  @Type(() => Call)
  @Field()
  call: Call;

  @Type(() => Proposal)
  @Field()
  proposal: Proposal;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;

  @Field(() => ProposalBookingStatus)
  status: ProposalBookingStatus;

  @Field(() => Int)
  allocatedTime: number;

  @Type(() => Instrument)
  @Field()
  instrument: Instrument;
}
