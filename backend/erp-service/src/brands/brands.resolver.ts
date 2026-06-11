import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateBrandInput } from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';
import { Brand } from './entities/brand.entity';
import { BrandsService } from './brands.service';

@Resolver(() => Brand)
export class BrandsResolver {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Brand], { name: 'brands' })
  findAll() {
    return this.brandsService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => Brand, { name: 'brand' })
  findOne(@Args('idMarca', { type: () => Int }) idMarca: number) {
    return this.brandsService.findOne(idMarca);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Brand, { name: 'createBrand' })
  create(@Args('input') input: CreateBrandInput) {
    return this.brandsService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Brand, { name: 'updateBrand' })
  update(@Args('input') input: UpdateBrandInput) {
    return this.brandsService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Brand, { name: 'deactivateBrand' })
  deactivate(@Args('idMarca', { type: () => Int }) idMarca: number) {
    return this.brandsService.deactivate(idMarca);
  }
}
