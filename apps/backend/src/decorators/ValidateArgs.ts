import { ResourceId } from '@user-office-software/duo-localisation';
import * as Yup from 'yup';

import { rejection } from '../rejection';

const schemaValidation = async (
  schema: Yup.AnyObjectSchema,
  inputArgs: unknown
) => {
  try {
    await schema.validate(inputArgs, { abortEarly: false });
  } catch (error) {
    return error;
  }

  return null;
};

const ValidateArgs = (...schemas: Yup.AnyObjectSchema[]) => {
  return (_target: object, _name: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      let inputArgs: unknown[];
      const firstArg = args[0] as Record<string, unknown> | undefined;
      if (firstArg?.isContext === true) {
        [, ...inputArgs] = args;
      } else {
        inputArgs = args;
      }

      for (let i = 0; i < schemas.length; i++) {
        const schema = schemas[i];
        const inputArg = inputArgs[i];

        const errors = await schemaValidation(schema, inputArg);

        if (errors) {
          // NOTE: Add BAD_REQUEST in the duo-localization
          return rejection('BAD_REQUEST' as ResourceId);
        }
      }

      return await originalMethod?.apply(this, args);
    };
  };
};

export default ValidateArgs;
