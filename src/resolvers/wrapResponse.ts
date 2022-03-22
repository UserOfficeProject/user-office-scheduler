import { Rejection, isRejection } from '../rejection';
import { getResponseField } from './Decorators';
import { ResponseWrapBase } from './types/wrappers';

export async function wrapResponse<T>(
  executor: Promise<T | Rejection>,
  ResponseWrapper: new () => ResponseWrapBase
): Promise<ResponseWrapBase> {
  const result = await executor;
  const wrapper = new ResponseWrapper();

  const responseFieldName = getResponseField(wrapper);
  if (responseFieldName) {
    isRejection(result)
      ? (wrapper.error = result.reason)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((wrapper as any)[responseFieldName] = result);
  } else {
    wrapper.error = `No response fields found in '${ResponseWrapper.name}'`;
    console.error(wrapper.error); // print out for easier debugging, most likely missing @Response() decorator
  }

  return wrapper;
}
