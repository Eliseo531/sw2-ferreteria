import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { AssignDeliveryDriverInput } from './dto/assign-delivery-driver.input';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryStatusInput } from './dto/update-delivery-status.input';
import { Delivery } from './entities/delivery.entity';
import { DeliveriesService } from './deliveries.service';

@Resolver(() => Delivery)
export class DeliveriesResolver {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO', 'REPARTIDOR')
  @Query(() => [Delivery], { name: 'deliveries' })
  findAll() {
    return this.deliveriesService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO', 'REPARTIDOR')
  @Query(() => Delivery, { name: 'delivery' })
  findOne(@Args('idEntrega', { type: () => Int }) idEntrega: number) {
    return this.deliveriesService.findOne(idEntrega);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO', 'REPARTIDOR')
  @Query(() => Delivery, { name: 'deliveryByOrder' })
  findByOrder(@Args('idPedido', { type: () => Int }) idPedido: number) {
    return this.deliveriesService.findByOrder(idPedido);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Delivery, { name: 'createDelivery' })
  create(@Args('input') input: CreateDeliveryInput) {
    return this.deliveriesService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Delivery, { name: 'assignDeliveryDriver' })
  assignDriver(@Args('input') input: AssignDeliveryDriverInput) {
    return this.deliveriesService.assignDriver(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'REPARTIDOR')
  @Mutation(() => Delivery, { name: 'updateDeliveryStatus' })
  updateStatus(@Args('input') input: UpdateDeliveryStatusInput) {
    return this.deliveriesService.updateStatus(input);
  }
}
