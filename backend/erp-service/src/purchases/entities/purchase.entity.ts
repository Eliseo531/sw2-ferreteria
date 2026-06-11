import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PurchaseDetail {
  @Field(() => Int)
  idDetalleCompra!: number;

  @Field(() => Int)
  idCompra!: number;

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
export class Purchase {
  @Field(() => Int)
  idCompra!: number;

  @Field(() => Int)
  idProveedor!: number;

  @Field(() => Int)
  idUsuario!: number;

  @Field()
  fechaCompra!: Date;

  @Field(() => Float)
  total!: number;

  @Field()
  estado!: string;

  @Field({ nullable: true })
  observacion?: string;

  @Field(() => [PurchaseDetail], { nullable: true })
  detalles?: PurchaseDetail[];
}
