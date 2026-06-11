import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const PRODUCTS_STOCK_QUERY = gql`
  query ProductsStock {
    products {
      idProducto
      nombre
      codigoBarras
      stockActual
      stockMinimo
      precioVenta
      estado
    }
  }
`;

const INVENTORY_MOVEMENTS_QUERY = gql`
  query InventoryMovements {
    inventoryMovements {
      idMovimiento
      idProducto
      idUsuario
      tipoMovimiento
      cantidad
      stockAnterior
      stockNuevo
      motivo
      fechaMovimiento
    }
  }
`;

const GENERATE_STOCK_ALERTS_MUTATION = gql`
  mutation GenerateStockAlerts {
    generateStockAlerts {
      idAlerta
      idProducto
      tipoAlerta
      mensaje
      estado
    }
  }
`;

const PENDING_ALERTS_QUERY = gql`
  query PendingAlerts {
    pendingAlerts {
      idAlerta
      idProducto
      tipoAlerta
      mensaje
      estado
      fechaCreacion
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apollo = inject(Apollo);

  getProductsStock() {
    return this.apollo.watchQuery<any>({
      query: PRODUCTS_STOCK_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  getInventoryMovements() {
    return this.apollo.watchQuery<any>({
      query: INVENTORY_MOVEMENTS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  generateStockAlerts() {
    return this.apollo.mutate<any>({
      mutation: GENERATE_STOCK_ALERTS_MUTATION,
    });
  }

  getPendingAlerts() {
    return this.apollo.watchQuery<any>({
      query: PENDING_ALERTS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }
}
