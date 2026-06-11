import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('idCategoria', { type: () => Int }) idCategoria: number) {
    return this.categoriesService.findOne(idCategoria);
  }

  @Mutation(() => Category, { name: 'createCategory' })
  create(@Args('input') input: CreateCategoryInput) {
    return this.categoriesService.create(input);
  }

  @Mutation(() => Category, { name: 'updateCategory' })
  update(@Args('input') input: UpdateCategoryInput) {
    return this.categoriesService.update(input);
  }

  @Mutation(() => Category, { name: 'deactivateCategory' })
  deactivate(@Args('idCategoria', { type: () => Int }) idCategoria: number) {
    return this.categoriesService.deactivate(idCategoria);
  }
}
