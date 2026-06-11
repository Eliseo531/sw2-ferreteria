import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field(() => Int)
  @IsNotEmpty()
  idProducto!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idCategoria?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idMarca?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idUnidad?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idUbicacion?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioVenta?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precioCompraReferencia?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockActual?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockMinimo?: number;
}
