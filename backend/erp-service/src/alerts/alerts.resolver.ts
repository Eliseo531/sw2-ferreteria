import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateAlertInput } from './dto/create-alert.input';
import { Alert } from './entities/alert.entity';
import { AlertsService } from './alerts.service';

@Resolver(() => Alert)
export class AlertsResolver {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Alert], { name: 'alerts' })
  findAll() {
    return this.alertsService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [Alert], { name: 'pendingAlerts' })
  findPending() {
    return this.alertsService.findPending();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Alert, { name: 'createAlert' })
  create(@Args('input') input: CreateAlertInput) {
    return this.alertsService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => [Alert], { name: 'generateStockAlerts' })
  generateStockAlerts() {
    return this.alertsService.generateStockAlerts();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Alert, { name: 'attendAlert' })
  attend(@Args('idAlerta', { type: () => Int }) idAlerta: number) {
    return this.alertsService.attend(idAlerta);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Alert, { name: 'ignoreAlert' })
  ignore(@Args('idAlerta', { type: () => Int }) idAlerta: number) {
    return this.alertsService.ignore(idAlerta);
  }
}
