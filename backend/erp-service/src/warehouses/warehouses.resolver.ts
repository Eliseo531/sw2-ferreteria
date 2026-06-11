import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateLocationInput } from './dto/create-location.input';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
import { Warehouse, WarehouseLocation } from './entities/warehouse.entity';
import { WarehousesService } from './warehouses.service';

@Resolver(() => Warehouse)
export class WarehousesResolver {
  constructor(private readonly warehousesService: WarehousesService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Warehouse], { name: 'warehouses' })
  findAll() {
    return this.warehousesService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => Warehouse, { name: 'warehouse' })
  findOne(@Args('idAlmacen', { type: () => Int }) idAlmacen: number) {
    return this.warehousesService.findOne(idAlmacen);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Warehouse, { name: 'createWarehouse' })
  createWarehouse(@Args('input') input: CreateWarehouseInput) {
    return this.warehousesService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Warehouse, { name: 'updateWarehouse' })
  updateWarehouse(@Args('input') input: UpdateWarehouseInput) {
    return this.warehousesService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Warehouse, { name: 'deactivateWarehouse' })
  deactivateWarehouse(
    @Args('idAlmacen', { type: () => Int }) idAlmacen: number,
  ) {
    return this.warehousesService.deactivate(idAlmacen);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => WarehouseLocation, { name: 'createWarehouseLocation' })
  createWarehouseLocation(@Args('input') input: CreateLocationInput) {
    return this.warehousesService.createLocation(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => WarehouseLocation, { name: 'updateWarehouseLocation' })
  updateWarehouseLocation(@Args('input') input: UpdateLocationInput) {
    return this.warehousesService.updateLocation(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => WarehouseLocation, { name: 'deleteWarehouseLocation' })
  deleteWarehouseLocation(
    @Args('idUbicacion', { type: () => Int }) idUbicacion: number,
  ) {
    return this.warehousesService.deleteLocation(idUbicacion);
  }
}
