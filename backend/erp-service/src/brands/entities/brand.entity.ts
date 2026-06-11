import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Brand {
  @Field(() => Int)
  idMarca!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  estado!: string;
}
