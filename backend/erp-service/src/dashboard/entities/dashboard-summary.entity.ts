import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardSummary {
  @Field(() => Int)
  totalProductos!: number;

  @Field(() => Int)
  totalClientes!: number;

  @Field(() => Int)
  totalProveedores!: number;

  @Field(() => Int)
  totalVentas!: number;

  @Field(() => Int)
  totalCompras!: number;

  @Field(() => Int)
  pedidosPendientes!: number;

  @Field(() => Int)
  entregasPendientes!: number;

  @Field(() => Int)
  alertasPendientes!: number;

  @Field(() => Float)
  montoTotalVentas!: number;

  @Field(() => Float)
  montoTotalCompras!: number;
}
