import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
export class UpdateDeliveryStatusInput {
  @Field(() => Int)
  @IsInt()
  idEntrega!: number;

  @Field()
  @IsIn(['PENDIENTE', 'EN_CAMINO', 'ENTREGADA', 'FALLIDA'])
  estado!: string;

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
  fotoEvidenciaUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string;
}
