import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field(() => Int)
  idCategoria!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field()
  estado!: string;
}
