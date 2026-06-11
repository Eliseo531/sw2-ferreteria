import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlockchainRecord {
  @Field(() => Int)
  idRegistro!: number;

  @Field()
  tipoDocumento!: string;

  @Field(() => Int)
  idReferencia!: number;

  @Field()
  hashDocumento!: string;

  @Field({ nullable: true })
  redBlockchain?: string;

  @Field({ nullable: true })
  txHash?: string;

  @Field()
  fechaRegistro!: Date;

  @Field()
  estado!: string;
}
