import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateSupplierInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nit?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion?: string;
}
