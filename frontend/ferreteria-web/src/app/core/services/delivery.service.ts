import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const DELIVERIES_QUERY = gql`
  query Deliveries {
    deliveries {
      idEntrega
      idPedido
      idRepartidor
      fechaSalida
      fechaEntrega
      estado
      direccionEntrega
      latitudEntrega
      longitudEntrega
      fotoEvidenciaUrl
      observacion
    }
  }
`;

const CREATE_DELIVERY_MUTATION = gql`
  mutation CreateDelivery($input: CreateDeliveryInput!) {
    createDelivery(input: $input) {
      idEntrega
      idPedido
      idRepartidor
      estado
      direccionEntrega
    }
  }
`;

const ASSIGN_DRIVER_MUTATION = gql`
  mutation AssignDeliveryDriver($input: AssignDeliveryDriverInput!) {
    assignDeliveryDriver(input: $input) {
      idEntrega
      idRepartidor
      estado
    }
  }
`;

const UPDATE_DELIVERY_STATUS_MUTATION = gql`
  mutation UpdateDeliveryStatus($input: UpdateDeliveryStatusInput!) {
    updateDeliveryStatus(input: $input) {
      idEntrega
      estado
      fechaSalida
      fechaEntrega
      fotoEvidenciaUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apollo = inject(Apollo);

  getDeliveries() {
    return this.apollo.watchQuery<any>({
      query: DELIVERIES_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createDelivery(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_DELIVERY_MUTATION,
      variables: { input },
    });
  }

  assignDriver(input: any) {
    return this.apollo.mutate<any>({
      mutation: ASSIGN_DRIVER_MUTATION,
      variables: { input },
    });
  }

  updateStatus(input: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_DELIVERY_STATUS_MUTATION,
      variables: { input },
    });
  }
}
