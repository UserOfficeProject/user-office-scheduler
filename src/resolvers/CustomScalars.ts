import { GraphQLScalarType, Kind } from 'graphql';
import { DateTime } from 'luxon';

export const TZ_LESS_DATE_TIME = 'yyyy-MM-dd HH:mm:ss';

function parseTzLessDateTime(value: string) {
  const parsed = DateTime.fromFormat(value, TZ_LESS_DATE_TIME);

  if (!parsed.isValid) {
    throw new Error('Invalid date/format');
  }

  return parsed.toJSDate();
}

export const TzLessDateTime = new GraphQLScalarType({
  name: 'TzLessDateTime',
  description: `DateTime without timezone in '${TZ_LESS_DATE_TIME}' format`,
  serialize(value: Date | unknown) {
    return DateTime.fromJSDate(value as Date).toFormat(TZ_LESS_DATE_TIME);
  },
  parseValue(value: string | unknown) {
    return parseTzLessDateTime(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      return null;
    }

    return parseTzLessDateTime(ast.value);
  },
});
