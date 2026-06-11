import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const SALES_QUERY = gql`
  query Sales {
    sales {
      idVenta
      idCliente
      idUsuario
      fechaVenta
      total
      metodoPago
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

const CREATE_SALE_MUTATION = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      idVenta
      total
      metodoPago
      estado
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apollo = inject(Apollo);

  getSales() {
    return this.apollo.watchQuery<any>({
      query: SALES_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createSale(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_SALE_MUTATION,
      variables: { input },
    });
  }
}
