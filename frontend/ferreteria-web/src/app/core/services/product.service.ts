import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const PRODUCTS_QUERY = gql`
  query Products {
    products {
      idProducto
      nombre
      codigoBarras
      precioVenta
      stockActual
      stockMinimo
      estado
    }
  }
`;

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      idProducto
      nombre
      codigoBarras
      precioVenta
      stockActual
      stockMinimo
      estado
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apollo = inject(Apollo);

  getProducts() {
    return this.apollo.watchQuery<any>({
      query: PRODUCTS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createProduct(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_PRODUCT_MUTATION,
      variables: { input },
    });
  }
}
