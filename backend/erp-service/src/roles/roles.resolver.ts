import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [Role], { name: 'roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { name: 'role' })
  findOne(@Args('idRol', { type: () => Int }) idRol: number) {
    return this.rolesService.findOne(idRol);
  }

  @Mutation(() => Role, { name: 'createRole' })
  create(@Args('input') input: CreateRoleInput) {
    return this.rolesService.create(input);
  }

  @Mutation(() => Role, { name: 'updateRole' })
  update(@Args('input') input: UpdateRoleInput) {
    return this.rolesService.update(input);
  }

  @Mutation(() => Role, { name: 'deleteRole' })
  delete(@Args('idRol', { type: () => Int }) idRol: number) {
    return this.rolesService.delete(idRol);
  }
}
