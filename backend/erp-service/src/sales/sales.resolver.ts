import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CancelSaleInput } from './dto/cancel-sale.input';
import { CreateSaleInput } from './dto/create-sale.input';
import { Sale } from './entities/sale.entity';
import { SalesService } from './sales.service';

@Resolver(() => Sale)
export class SalesResolver {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Query(() => [Sale], { name: 'sales' })
  findAll() {
    return this.salesService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Query(() => Sale, { name: 'sale' })
  findOne(@Args('idVenta', { type: () => Int }) idVenta: number) {
    return this.salesService.findOne(idVenta);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Sale, { name: 'createSale' })
  create(@Args('input') input: CreateSaleInput) {
    return this.salesService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Sale, { name: 'cancelSale' })
  cancel(@Args('input') input: CancelSaleInput) {
    return this.salesService.cancel(input);
  }
}
