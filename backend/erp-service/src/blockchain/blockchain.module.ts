import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainResolver } from './blockchain.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BlockchainResolver, BlockchainService],
})
export class BlockchainModule {}
