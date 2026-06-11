import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO')
  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO')
  @Query(() => Order, { name: 'order' })
  findOne(@Args('idPedido', { type: () => Int }) idPedido: number) {
    return this.ordersService.findOne(idPedido);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Order, { name: 'createOrder' })
  create(@Args('input') input: CreateOrderInput) {
    return this.ordersService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO')
  @Mutation(() => Order, { name: 'updateOrderStatus' })
  updateStatus(@Args('input') input: UpdateOrderStatusInput) {
    return this.ordersService.updateStatus(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Order, { name: 'cancelOrder' })
  cancel(@Args('idPedido', { type: () => Int }) idPedido: number) {
    return this.ordersService.cancel(idPedido);
  }
}
