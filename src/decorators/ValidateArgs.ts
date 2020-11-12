/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResourceId } from '@esss-swap/duo-localisation';
import * as yup from 'yup';

import { Rejection, rejection } from '../rejection';

const schemaValidation = async (schema: yup.Schema<any>, inputArgs: any) => {
  try {
    await schema.validate(inputArgs, { abortEarly: false });
  } catch (error) {
    return error;
  }

  return null;
};

const ValidateArgs = (...schemas: yup.Schema<any>[]) => {
  return (
    target: object,
    name: string,
    descriptor: {
      value?: (...args: any[]) => Promise<Rejection | any>;
    }
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args) {
      let inputArgs;
      if (args[0]?.isContext === true) {
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
