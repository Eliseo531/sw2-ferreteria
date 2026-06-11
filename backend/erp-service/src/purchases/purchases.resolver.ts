import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CancelPurchaseInput } from './dto/cancel-purchase.input';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { Purchase } from './entities/purchase.entity';
import { PurchasesService } from './purchases.service';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(private readonly purchasesService: PurchasesService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Purchase], { name: 'purchases' })
  findAll() {
    return this.purchasesService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => Purchase, { name: 'purchase' })
  findOne(@Args('idCompra', { type: () => Int }) idCompra: number) {
    return this.purchasesService.findOne(idCompra);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Purchase, { name: 'createPurchase' })
  create(@Args('input') input: CreatePurchaseInput) {
    return this.purchasesService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Purchase, { name: 'cancelPurchase' })
  cancel(@Args('input') input: CancelPurchaseInput) {
    return this.purchasesService.cancel(input);
  }
}
