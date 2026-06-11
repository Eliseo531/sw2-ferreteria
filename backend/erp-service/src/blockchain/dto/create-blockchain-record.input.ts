import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateBlockchainRecordInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  tipoDocumento!: string;

  @Field(() => Int)
  @IsInt()
  idReferencia!: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  hashDocumento!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  redBlockchain?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  txHash?: string;
}
