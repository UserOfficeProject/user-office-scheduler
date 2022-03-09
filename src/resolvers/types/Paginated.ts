import { ObjectType, Field, Int, ClassType } from 'type-graphql';

export abstract class PaginatedClass<TItem> {
  list: TItem[];
  total: number;
  current: number;
  hasMore: boolean;
}

export default function Paginated<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedClass {
    // here we use the runtime argument
    @Field(() => [TItemClass])
    // and here the generic type
    list: TItem[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    current: number;

    @Field()
    hasMore: boolean;
  }

  return PaginatedClass;
}
