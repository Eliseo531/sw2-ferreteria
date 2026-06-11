import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateSaleDetailInput {
  @Field(() => Int)
  @IsInt()
  idProducto!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad!: number;

  @Field(() => Float)
  @Min(0)
  precioUnitario!: number;
}

@InputType()
export class CreateSaleInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idCliente?: number;

  @Field(() => Int)
  @IsInt()
  idUsuario!: number;

  @Field()
  @IsIn(['EFECTIVO', 'QR', 'TARJETA', 'TRANSFERENCIA'])
  metodoPago!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string;

  @Field(() => [CreateSaleDetailInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailInput)
  detalles!: CreateSaleDetailInput[];
}
