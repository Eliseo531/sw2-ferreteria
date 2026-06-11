import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => Int)
  idDocumento!: number;

  @Field(() => Int, { nullable: true })
  idProducto?: number;

  @Field(() => Int, { nullable: true })
  idProveedor?: number;

  @Field()
  nombre!: string;

  @Field()
  tipoDocumento!: string;

  @Field()
  urlArchivo!: string;

  @Field()
  fechaCarga!: Date;

  @Field({ nullable: true })
  fechaVencimiento?: Date;

  @Field()
  estado!: string;
}
