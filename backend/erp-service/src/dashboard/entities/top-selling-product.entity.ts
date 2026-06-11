import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TopSellingProduct {
  @Field(() => Int)
  idProducto!: number;

  @Field()
  nombre!: string;

  @Field(() => Int)
  cantidadVendida!: number;

  @Field(() => Float)
  totalVendido!: number;
}
