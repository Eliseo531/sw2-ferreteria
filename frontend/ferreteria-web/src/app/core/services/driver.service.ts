import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const USERS_QUERY = gql`
  query Users {
    users {
      idUsuario
      nombre
      apellido
      email
      telefono
      estado
      roles {
        nombre
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apollo = inject(Apollo);

  getDrivers() {
    return this.apollo.watchQuery<any>({
      query: USERS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }
}
