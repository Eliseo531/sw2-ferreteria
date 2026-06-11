import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const PURCHASES_QUERY = gql`
  query Purchases {
    purchases {
      idCompra
      idProveedor
      idUsuario
      fechaCompra
      total
      estado
      observacion
      detalles {
        idProducto
        cantidad
        precioUnitario
        subtotal
      }
    }
  }
`;

const CREATE_PURCHASE_MUTATION = gql`
  mutation CreatePurchase($input: CreatePurchaseInput!) {
    createPurchase(input: $input) {
      idCompra
      total
      estado
      detalles {
        idProducto
        cantidad
        precioUnitario
        subtotal
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apollo = inject(Apollo);

  getPurchases() {
    return this.apollo.watchQuery<any>({
      query: PURCHASES_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createPurchase(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_PURCHASE_MUTATION,
      variables: { input },
    });
  }
}
