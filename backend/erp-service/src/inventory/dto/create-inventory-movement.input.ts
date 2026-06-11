import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateInventoryMovementInput {
  @Field(() => Int)
  @IsInt()
  idProducto!: number;

  @Field(() => Int)
  @IsInt()
  idUsuario!: number;

  @Field()
  @IsNotEmpty()
  @IsIn([
    'ENTRADA_COMPRA',
    'SALIDA_VENTA',
    'AJUSTE_POSITIVO',
    'AJUSTE_NEGATIVO',
    'SALIDA_PEDIDO',
  ])
  tipoMovimiento!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  motivo?: string;
}
