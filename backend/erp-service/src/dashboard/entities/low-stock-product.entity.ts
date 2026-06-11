import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LowStockProduct {
  @Field(() => Int)
  idProducto!: number;

  @Field()
  nombre!: string;

  @Field(() => Int)
  stockActual!: number;

  @Field(() => Int)
  stockMinimo!: number;
}
