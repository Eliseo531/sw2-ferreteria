import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Query(() => User, { name: 'user' })
  findOne(@Args('idUsuario', { type: () => Int }) idUsuario: number) {
    return this.usersService.findOne(idUsuario);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => User, { name: 'createUser' })
  create(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => User, { name: 'updateUser' })
  update(@Args('input') input: UpdateUserInput) {
    return this.usersService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => User, { name: 'deactivateUser' })
  deactivate(@Args('idUsuario', { type: () => Int }) idUsuario: number) {
    return this.usersService.deactivate(idUsuario);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => User, { name: 'assignRoleToUser' })
  assignRoleToUser(
    @Args('idUsuario', { type: () => Int }) idUsuario: number,
    @Args('idRol', { type: () => Int }) idRol: number,
  ) {
    return this.usersService.assignRoleToUser(idUsuario, idRol);
  }
}
