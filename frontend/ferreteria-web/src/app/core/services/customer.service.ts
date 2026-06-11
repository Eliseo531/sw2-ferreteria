import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const CUSTOMERS_QUERY = gql`
  query Customers {
    customers {
      idCliente
      nombre
      apellido
      nitCi
      telefono
      email
      direccion
      tipoCliente
      estado
    }
  }
`;

const CREATE_CUSTOMER_MUTATION = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      idCliente
      nombre
      apellido
      nitCi
      telefono
      email
      direccion
      tipoCliente
      estado
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apollo = inject(Apollo);

  getCustomers() {
    return this.apollo.watchQuery<any>({
      query: CUSTOMERS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createCustomer(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_CUSTOMER_MUTATION,
      variables: { input },
    });
  }
}
