import { GraphQLScalarType } from 'graphql';
import { DateTime } from 'luxon';

export const TzLessDateTime = new GraphQLScalarType({
  name: 'TzLessDateTime',
  description: 'DateTime without timezone in `yyyy-MM-dd HH:mm:ss` format',
  serialize(value: Date) {
    return DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm:ss');
  },
  parseValue(value: string) {
    const parsed = DateTime.fromFormat(value, 'yyyy-MM-dd HH:mm:ss');

    if (!parsed.isValid) {
      throw new Error('Invalid date/format');
    }

    return parsed.toJSDate();
  },
});
