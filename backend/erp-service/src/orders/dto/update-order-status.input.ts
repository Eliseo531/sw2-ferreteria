import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => Int)
  @IsInt()
  idPedido!: number;

  @Field()
  @IsIn([
    'PENDIENTE',
    'CONFIRMADO',
    'PREPARANDO',
    'EN_REPARTO',
    'ENTREGADO',
    'CANCELADO',
  ])
  estado!: string;
}
