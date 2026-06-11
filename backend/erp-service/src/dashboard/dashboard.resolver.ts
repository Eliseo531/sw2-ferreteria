import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './entities/dashboard-summary.entity';
import { LowStockProduct } from './entities/low-stock-product.entity';
import { TopSellingProduct } from './entities/top-selling-product.entity';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR', 'ALMACENERO')
  @Query(() => DashboardSummary, { name: 'dashboardSummary' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'ALMACENERO')
  @Query(() => [LowStockProduct], { name: 'lowStockProducts' })
  getLowStockProducts() {
    return this.dashboardService.getLowStockProducts();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'VENDEDOR')
  @Query(() => [TopSellingProduct], { name: 'topSellingProducts' })
  getTopSellingProducts() {
    return this.dashboardService.getTopSellingProducts();
  }
}
