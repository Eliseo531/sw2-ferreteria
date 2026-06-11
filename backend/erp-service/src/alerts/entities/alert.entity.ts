import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Alert {
  @Field(() => Int)
  idAlerta!: number;

  @Field(() => Int, { nullable: true })
  idProducto?: number;

  @Field()
  tipoAlerta!: string;

  @Field()
  mensaje!: string;

  @Field()
  estado!: string;

  @Field()
  fechaCreacion!: Date;

  @Field({ nullable: true })
  fechaAtencion?: Date;
}
