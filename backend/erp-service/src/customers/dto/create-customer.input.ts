import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  apellido?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nitCi?: string;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['MINORISTA', 'CONSTRUCTOR', 'ELECTRICISTA', 'MAYORISTA', 'EMPRESA'])
  tipoCliente?: string;
}
