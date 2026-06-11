import { gql } from "@apollo/client";

export const PRODUCTS_STOCK_QUERY = gql`
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
