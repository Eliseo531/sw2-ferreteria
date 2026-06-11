import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  idProducto!: number;

  @Field(() => Int)
  idCategoria!: number;

  @Field(() => Int, { nullable: true })
  idMarca?: number;

  @Field(() => Int)
  idUnidad!: number;

  @Field(() => Int, { nullable: true })
  idUbicacion?: number;

  @Field({ nullable: true })
  codigoBarras?: string;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Float)
  precioVenta!: number;

  @Field(() => Float, { nullable: true })
  precioCompraReferencia?: number;

  @Field(() => Int)
  stockActual!: number;

  @Field(() => Int)
  stockMinimo!: number;

  @Field()
  estado!: string;

  @Field()
  fechaCreacion!: Date;
}
