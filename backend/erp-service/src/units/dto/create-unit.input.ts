import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUnitInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  abreviatura!: string;
}
