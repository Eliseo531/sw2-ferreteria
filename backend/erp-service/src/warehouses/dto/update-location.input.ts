import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateLocationInput {
  @Field(() => Int)
  @IsNotEmpty()
  idUbicacion!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pasillo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  estante?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nivel?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
