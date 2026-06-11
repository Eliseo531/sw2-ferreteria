import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => Int)
  idRol!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  descripcion?: string;
}
