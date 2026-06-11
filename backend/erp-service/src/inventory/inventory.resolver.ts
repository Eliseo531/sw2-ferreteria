import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateInventoryMovementInput } from './dto/create-inventory-movement.input';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { InventoryService } from './inventory.service';

@Resolver(() => InventoryMovement)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [InventoryMovement], { name: 'inventoryMovements' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [InventoryMovement], { name: 'inventoryMovementsByProduct' })
  findByProduct(@Args('idProducto', { type: () => Int }) idProducto: number) {
    return this.inventoryService.findByProduct(idProducto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => InventoryMovement, { name: 'createInventoryMovement' })
  create(@Args('input') input: CreateInventoryMovementInput) {
    return this.inventoryService.create(input);
  }
}
