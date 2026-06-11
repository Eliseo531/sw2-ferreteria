import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersResolver } from './suppliers.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SuppliersResolver, SuppliersService],
})
export class SuppliersModule {}
