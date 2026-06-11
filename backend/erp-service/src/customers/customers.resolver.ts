import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Query(() => [Customer], { name: 'customers' })
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('idCliente', { type: () => Int }) idCliente: number) {
    return this.customersService.findOne(idCliente);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Customer, { name: 'createCustomer' })
  create(@Args('input') input: CreateCustomerInput) {
    return this.customersService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Mutation(() => Customer, { name: 'updateCustomer' })
  update(@Args('input') input: UpdateCustomerInput) {
    return this.customersService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Customer, { name: 'deactivateCustomer' })
  deactivate(@Args('idCliente', { type: () => Int }) idCliente: number) {
    return this.customersService.deactivate(idCliente);
  }
}
