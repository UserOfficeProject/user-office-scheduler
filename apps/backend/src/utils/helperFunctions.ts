/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProposalMessageData } from '../types/shared';

export function isSetAndPopulated<T>(
  itemToCheck?: T | T[]
): itemToCheck is T | T[] {
  return !!itemToCheck && !!Object.keys(itemToCheck).length;
}

export const hasTriggerStatus = (
  message: ProposalMessageData,
  statuses: string[] | undefined
) => {
  if (!message.newStatus || !statuses) {
    return false;
  }

  // NOTE: If new status is not one of the triggering statuses
  if (statuses.indexOf(message.newStatus as string) === -1) {
    return false;
  }

  return true;
};

export function validateProposalMessage(
  proposalMessage: any
): ProposalMessageData {
  if (!proposalMessage.title) {
    throw new Error('Proposal title is missing');
  }

  if (!proposalMessage.shortCode) {
    throw new Error('Proposal short code is missing');
  }

  if (!proposalMessage.proposalPk) {
    throw new Error('Proposal primary key is missing');
  }

  if (!proposalMessage.callId) {
    throw new Error('Proposal call is missing');
  }

  if (!proposalMessage.instruments) {
    throw new Error('Proposal instruments are missing');
  }

  proposalMessage.instruments.forEach((instrument: any) => {
    if (!instrument.id) {
      throw new Error('Instrument id is missing');
    }

    if (!instrument.shortCode) {
      throw new Error('Instrument short code is missing');
    }

    if (typeof instrument.allocatedTime !== 'number') {
      throw new Error('Instrument allocated time is missing');
    }
  });

  return proposalMessage as ProposalMessageData;
}
