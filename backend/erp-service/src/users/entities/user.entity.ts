import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserRoleInfo {
  @Field(() => Int)
  idRol!: number;

  @Field()
  nombre!: string;

  @Field({ nullable: true })
  descripcion?: string;
}

@ObjectType()
export class User {
  @Field(() => Int)
  idUsuario!: number;

  @Field()
  nombre!: string;

  @Field()
  apellido!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field()
  estado!: string;

  @Field()
  fechaCreacion!: Date;

  @Field(() => [UserRoleInfo], { nullable: true })
  roles?: UserRoleInfo[];
}
