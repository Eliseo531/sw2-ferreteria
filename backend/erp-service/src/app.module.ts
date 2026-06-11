import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { UnitsModule } from './units/units.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CustomersModule } from './customers/customers.module';
import { SalesModule } from './sales/sales.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DocumentsModule } from './documents/documents.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true,
      context: ({ req, request }) => ({
        req: req || request,
      }),
    }),

    CategoriesModule,

    RolesModule,

    UsersModule,

    AuthModule,

    BrandsModule,

    UnitsModule,

    WarehousesModule,

    ProductsModule,

    InventoryModule,

    SuppliersModule,

    PurchasesModule,

    CustomersModule,

    SalesModule,

    OrdersModule,

    DeliveriesModule,

    AlertsModule,

    DashboardModule,

    DocumentsModule,

    BlockchainModule,
  ],
})
export class AppModule {}
