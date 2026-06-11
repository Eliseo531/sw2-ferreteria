import { gql } from "@apollo/client";

export const PENDING_ALERTS_QUERY = gql`
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

export const ATTEND_ALERT_MUTATION = gql`
  mutation AttendAlert($idAlerta: Int!) {
    attendAlert(idAlerta: $idAlerta) {
      idAlerta
      estado
    }
  }
`;
