import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CancelPurchaseInput {
  @Field(() => Int)
  @IsInt()
  idCompra!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  motivo?: string;
}
