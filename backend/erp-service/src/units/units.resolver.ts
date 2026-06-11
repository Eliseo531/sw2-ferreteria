import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateUnitInput } from './dto/create-unit.input';
import { Unit } from './entities/unit.entity';
import { UpdateUnitInput } from './dto/update-unit.input';
import { UnitsService } from './units.service';

@Resolver(() => Unit)
export class UnitsResolver {
  constructor(private readonly unitsService: UnitsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Unit], { name: 'units' })
  findAll() {
    return this.unitsService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => Unit, { name: 'unit' })
  findOne(@Args('idUnidad', { type: () => Int }) idUnidad: number) {
    return this.unitsService.findOne(idUnidad);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Unit, { name: 'createUnit' })
  create(@Args('input') input: CreateUnitInput) {
    return this.unitsService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Unit, { name: 'updateUnit' })
  update(@Args('input') input: UpdateUnitInput) {
    return this.unitsService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Unit, { name: 'deleteUnit' })
  delete(@Args('idUnidad', { type: () => Int }) idUnidad: number) {
    return this.unitsService.delete(idUnidad);
  }
}
