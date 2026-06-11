import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class AssignDeliveryDriverInput {
  @Field(() => Int)
  @IsInt()
  idEntrega!: number;

  @Field(() => Int)
  @IsInt()
  idRepartidor!: number;
}
