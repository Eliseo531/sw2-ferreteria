import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateAlertInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idProducto?: number;

  @Field()
  @IsIn([
    'STOCK_BAJO',
    'DESABASTECIMIENTO',
    'ALTA_DEMANDA',
    'DOCUMENTO_VENCIDO',
  ])
  tipoAlerta!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  mensaje!: string;
}
