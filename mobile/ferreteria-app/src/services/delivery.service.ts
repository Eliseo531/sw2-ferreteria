import { gql } from "@apollo/client";

export const DELIVERIES_QUERY = gql`
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
      observacion
    }
  }
`;

export const UPDATE_DELIVERY_STATUS_MUTATION = gql`
  mutation UpdateDeliveryStatus($input: UpdateDeliveryStatusInput!) {
    updateDeliveryStatus(input: $input) {
      idEntrega
      estado
      fechaSalida
      fechaEntrega
      fotoEvidenciaUrl
      observacion
    }
  }
`;
