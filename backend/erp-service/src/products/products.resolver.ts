import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR')
  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR')
  @Query(() => Product, { name: 'product' })
  findOne(@Args('idProducto', { type: () => Int }) idProducto: number) {
    return this.productsService.findOne(idProducto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Product, { name: 'createProduct' })
  create(@Args('input') input: CreateProductInput) {
    return this.productsService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Product, { name: 'updateProduct' })
  update(@Args('input') input: UpdateProductInput) {
    return this.productsService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Product, { name: 'deactivateProduct' })
  deactivate(@Args('idProducto', { type: () => Int }) idProducto: number) {
    return this.productsService.deactivate(idProducto);
  }
}
