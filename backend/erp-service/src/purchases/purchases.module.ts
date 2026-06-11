import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesResolver } from './purchases.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PurchasesResolver, PurchasesService],
})
export class PurchasesModule {}
