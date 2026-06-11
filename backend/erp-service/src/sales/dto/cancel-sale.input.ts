import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class CancelSaleInput {
  @Field(() => Int)
  @IsInt()
  idVenta!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  motivo?: string;
}
