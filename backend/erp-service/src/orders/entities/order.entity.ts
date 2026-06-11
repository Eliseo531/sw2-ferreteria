import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderDetail {
  @Field(() => Int)
  idDetallePedido!: number;

  @Field(() => Int)
  idPedido!: number;

  @Field(() => Int)
  idProducto!: number;

  @Field(() => Int)
  cantidad!: number;

  @Field(() => Float)
  precioEstimado!: number;

  @Field(() => Float)
  subtotal!: number;
}

@ObjectType()
export class Order {
  @Field(() => Int)
  idPedido!: number;

  @Field(() => Int, { nullable: true })
  idCliente?: number;

  @Field(() => Int, { nullable: true })
  idUsuarioRegistro?: number;

  @Field()
  origen!: string;

  @Field()
  fechaPedido!: Date;

  @Field()
  estado!: string;

  @Field(() => Float, { nullable: true })
  totalEstimado?: number;

  @Field({ nullable: true })
  observacion?: string;

  @Field(() => [OrderDetail], { nullable: true })
  detalles?: OrderDetail[];
}
