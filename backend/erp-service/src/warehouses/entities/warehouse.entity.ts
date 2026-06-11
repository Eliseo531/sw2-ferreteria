import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WarehouseLocation {
  @Field(() => Int)
  idUbicacion!: number;

  @Field({ nullable: true })
  pasillo?: string;

  @Field({ nullable: true })
  estante?: string;

  @Field({ nullable: true })
  nivel?: string;

  @Field({ nullable: true })
  descripcion?: string;
}

@ObjectType()
export class Warehouse {
  @Field(() => Int)
  idAlmacen!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  estado!: string;

  @Field(() => [WarehouseLocation], { nullable: true })
  ubicaciones?: WarehouseLocation[];
}
