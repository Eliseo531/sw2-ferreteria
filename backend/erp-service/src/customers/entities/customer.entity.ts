import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => Int)
  idCliente!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  apellido?: string;

  @Field({ nullable: true })
  nitCi?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field()
  tipoCliente!: string;

  @Field()
  estado!: string;

  @Field()
  fechaRegistro!: Date;
}
