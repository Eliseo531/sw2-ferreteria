import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'products',
        loadComponent: () => import('./features/products/products').then((m) => m.Products),
      },

      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customers').then((m) => m.Customers),
      },

      {
        path: 'sales',
        loadComponent: () => import('./features/sales/sales').then((m) => m.Sales),
      },

      {
        path: 'purchases',
        loadComponent: () => import('./features/purchases/purchases').then((m) => m.Purchases),
      },

      {
        path: 'documents',
        loadComponent: () => import('./features/documents/documents').then((m) => m.Documents),
      },

      {
        path: 'ai',
        loadComponent: () => import('./features/ai/ai').then((m) => m.Ai),
      },

      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory').then((m) => m.Inventory),
      },

      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders').then((m) => m.Orders),
      },

      {
        path: 'deliveries',
        loadComponent: () => import('./features/deliveries/deliveries').then((m) => m.Deliveries),
      },

      {
        path: 'drivers',
        loadComponent: () => import('./features/drivers/drivers').then((m) => m.Drivers),
      },

      {
        path: 'users',
        loadComponent: () => import('./features/users/users').then((m) => m.Users),
      },

      {
        path: 'inventory-intelligence',
        loadComponent: () =>
          import('./features/inventory-intelligence/inventory-intelligence').then(
            (m) => m.InventoryIntelligence,
          ),
      },
    ],
  },
];
