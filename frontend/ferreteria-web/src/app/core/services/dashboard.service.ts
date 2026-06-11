import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const DASHBOARD_SUMMARY_QUERY = gql`
  query DashboardSummary {
    dashboardSummary {
      totalProductos
      totalClientes
      totalProveedores
      totalVentas
      totalCompras
      pedidosPendientes
      entregasPendientes
      alertasPendientes
      montoTotalVentas
      montoTotalCompras
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apollo = inject(Apollo);

  getSummary() {
    return this.apollo.watchQuery<any>({
      query: DASHBOARD_SUMMARY_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }
}
