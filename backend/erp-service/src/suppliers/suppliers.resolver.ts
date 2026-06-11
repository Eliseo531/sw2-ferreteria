import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateSupplierInput } from './dto/create-supplier.input';
import { Supplier } from './entities/supplier.entity';
import { SuppliersService } from './suppliers.service';
import { UpdateSupplierInput } from './dto/update-supplier.input';

@Resolver(() => Supplier)
export class SuppliersResolver {
  constructor(private readonly suppliersService: SuppliersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Supplier], { name: 'suppliers' })
  findAll() {
    return this.suppliersService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => Supplier, { name: 'supplier' })
  findOne(@Args('idProveedor', { type: () => Int }) idProveedor: number) {
    return this.suppliersService.findOne(idProveedor);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Supplier, { name: 'createSupplier' })
  create(@Args('input') input: CreateSupplierInput) {
    return this.suppliersService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Supplier, { name: 'updateSupplier' })
  update(@Args('input') input: UpdateSupplierInput) {
    return this.suppliersService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Supplier, { name: 'deactivateSupplier' })
  deactivate(@Args('idProveedor', { type: () => Int }) idProveedor: number) {
    return this.suppliersService.deactivate(idProveedor);
  }
}
