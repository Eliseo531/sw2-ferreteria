import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SaleDetail {
  @Field(() => Int)
  idDetalleVenta!: number;

  @Field(() => Int)
  idVenta!: number;

  @Field(() => Int)
  idProducto!: number;

  @Field(() => Int)
  cantidad!: number;

  @Field(() => Float)
  precioUnitario!: number;

  @Field(() => Float)
  subtotal!: number;
}

@ObjectType()
export class Sale {
  @Field(() => Int)
  idVenta!: number;

  @Field(() => Int, { nullable: true })
  idCliente?: number;

  @Field(() => Int)
  idUsuario!: number;

  @Field()
  fechaVenta!: Date;

  @Field(() => Float)
  total!: number;

  @Field()
  metodoPago!: string;

  @Field()
  estado!: string;

  @Field({ nullable: true })
  observacion?: string;

  @Field(() => [SaleDetail], { nullable: true })
  detalles?: SaleDetail[];
}
