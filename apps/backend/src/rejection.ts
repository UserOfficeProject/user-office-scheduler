import { ResourceId } from '@user-office-software/duo-localisation'; // import

const REJECTION = Symbol('REJECTION');

export interface Rejection {
  [REJECTION]: true;
  reason: string;
}

export function rejection(reason: ResourceId): Rejection {
  return { [REJECTION]: true, reason };
}

export function isRejection(value: unknown): value is Rejection {
  return REJECTION in Object(value);
}
