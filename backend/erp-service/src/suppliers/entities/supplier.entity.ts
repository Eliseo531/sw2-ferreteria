import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Supplier {
  @Field(() => Int)
  idProveedor!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  nit?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field()
  estado!: string;

  @Field()
  fechaRegistro!: Date;
}
