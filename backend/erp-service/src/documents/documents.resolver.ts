import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR')
  @Query(() => [Document], { name: 'documents' })
  findAll() {
    return this.documentsService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR')
  @Query(() => Document, { name: 'document' })
  findOne(@Args('idDocumento', { type: () => Int }) idDocumento: number) {
    return this.documentsService.findOne(idDocumento);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR')
  @Query(() => [Document], { name: 'documentsByProduct' })
  findByProduct(@Args('idProducto', { type: () => Int }) idProducto: number) {
    return this.documentsService.findByProduct(idProducto);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO', 'VENDEDOR')
  @Query(() => [Document], { name: 'documentsBySupplier' })
  findBySupplier(
    @Args('idProveedor', { type: () => Int }) idProveedor: number,
  ) {
    return this.documentsService.findBySupplier(idProveedor);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Document, { name: 'createDocument' })
  create(@Args('input') input: CreateDocumentInput) {
    return this.documentsService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Mutation(() => Document, { name: 'updateDocument' })
  update(@Args('input') input: UpdateDocumentInput) {
    return this.documentsService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => Document, { name: 'deactivateDocument' })
  deactivate(@Args('idDocumento', { type: () => Int }) idDocumento: number) {
    return this.documentsService.deactivate(idDocumento);
  }
}
