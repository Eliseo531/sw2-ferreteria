import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class MarkBlockchainRecordInput {
  @Field(() => Int)
  @IsInt()
  idRegistro!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  redBlockchain!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  txHash!: string;
}
