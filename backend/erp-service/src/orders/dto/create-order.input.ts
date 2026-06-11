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
export class CreateOrderDetailInput {
  @Field(() => Int)
  @IsInt()
  idProducto!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cantidad!: number;

  @Field(() => Float)
  @Min(0)
  precioEstimado!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idCliente?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idUsuarioRegistro?: number;

  @Field()
  @IsIn(['WHATSAPP', 'WEB', 'MOVIL', 'PRESENCIAL'])
  origen!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string;

  @Field(() => [CreateOrderDetailInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailInput)
  detalles!: CreateOrderDetailInput[];
}
