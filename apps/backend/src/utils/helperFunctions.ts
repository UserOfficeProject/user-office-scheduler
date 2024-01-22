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
