import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreatePurchaseDetailInput {
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
export class CreatePurchaseInput {
  @Field(() => Int)
  @IsInt()
  idProveedor!: number;

  @Field(() => Int)
  @IsInt()
  idUsuario!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string;

  @Field(() => [CreatePurchaseDetailInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailInput)
  detalles!: CreatePurchaseDetailInput[];
}
