import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InventoryMovement {
  @Field(() => Int)
  idMovimiento!: number;

  @Field(() => Int)
  idProducto!: number;

  @Field(() => Int)
  idUsuario!: number;

  @Field()
  tipoMovimiento!: string;

  @Field(() => Int)
  cantidad!: number;

  @Field(() => Int)
  stockAnterior!: number;

  @Field(() => Int)
  stockNuevo!: number;

  @Field({ nullable: true })
  motivo?: string;

  @Field()
  fechaMovimiento!: Date;
}
