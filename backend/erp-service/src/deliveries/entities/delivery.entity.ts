import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Delivery {
  @Field(() => Int)
  idEntrega!: number;

  @Field(() => Int)
  idPedido!: number;

  @Field(() => Int, { nullable: true })
  idRepartidor?: number;

  @Field({ nullable: true })
  fechaSalida?: Date;

  @Field({ nullable: true })
  fechaEntrega?: Date;

  @Field()
  estado!: string;

  @Field()
  direccionEntrega!: string;

  @Field(() => Float, { nullable: true })
  latitudEntrega?: number;

  @Field(() => Float, { nullable: true })
  longitudEntrega?: number;

  @Field({ nullable: true })
  fotoEvidenciaUrl?: string;

  @Field({ nullable: true })
  observacion?: string;
}
