import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Unit {
  @Field(() => Int)
  idUnidad!: number;

  @Field()
  nombre!: string;

  @Field()
  abreviatura!: string;
}
