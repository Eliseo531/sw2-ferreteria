import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { BlockchainService } from './blockchain.service';
import { CreateBlockchainRecordInput } from './dto/create-blockchain-record.input';
import { MarkBlockchainRecordInput } from './dto/mark-blockchain-record.input';
import { BlockchainRecord } from './entities/blockchain-record.entity';

@Resolver(() => BlockchainRecord)
export class BlockchainResolver {
  constructor(private readonly blockchainService: BlockchainService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Query(() => [BlockchainRecord], { name: 'blockchainRecords' })
  findAll() {
    return this.blockchainService.findAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Query(() => BlockchainRecord, { name: 'blockchainRecord' })
  findOne(@Args('idRegistro', { type: () => Int }) idRegistro: number) {
    return this.blockchainService.findOne(idRegistro);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => BlockchainRecord, { name: 'createBlockchainRecord' })
  create(@Args('input') input: CreateBlockchainRecordInput) {
    return this.blockchainService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => BlockchainRecord, {
    name: 'markBlockchainRecordAsRegistered',
  })
  markAsRegistered(@Args('input') input: MarkBlockchainRecordInput) {
    return this.blockchainService.markAsRegistered(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @Mutation(() => BlockchainRecord, { name: 'markBlockchainRecordAsError' })
  markAsError(@Args('idRegistro', { type: () => Int }) idRegistro: number) {
    return this.blockchainService.markAsError(idRegistro);
  }
}
