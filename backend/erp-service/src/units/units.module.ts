import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsResolver } from './units.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UnitsResolver, UnitsService],
})
export class UnitsModule {}
