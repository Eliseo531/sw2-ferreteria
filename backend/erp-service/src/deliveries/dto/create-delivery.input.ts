import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateDeliveryInput {
  @Field(() => Int)
  @IsInt()
  idPedido!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idRepartidor?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  direccionEntrega!: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitudEntrega?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitudEntrega?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string;
}
