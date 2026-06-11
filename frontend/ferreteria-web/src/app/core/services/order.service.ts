import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const ORDERS_QUERY = gql`
  query Orders {
    orders {
      idPedido
      idCliente
      idUsuarioRegistro
      origen
      fechaPedido
      estado
      totalEstimado
      observacion
      detalles {
        idProducto
        cantidad
        precioEstimado
        subtotal
      }
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      idPedido
      idCliente
      origen
      estado
      totalEstimado
    }
  }
`;

const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      idPedido
      estado
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apollo = inject(Apollo);

  getOrders() {
    return this.apollo.watchQuery<any>({
      query: ORDERS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createOrder(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_ORDER_MUTATION,
      variables: { input },
    });
  }

  updateOrderStatus(input: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_ORDER_STATUS_MUTATION,
      variables: { input },
    });
  }
}
