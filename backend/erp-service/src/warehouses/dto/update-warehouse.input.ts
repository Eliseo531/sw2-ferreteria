import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateWarehouseInput {
  @Field(() => Int)
  @IsNotEmpty()
  idAlmacen!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
