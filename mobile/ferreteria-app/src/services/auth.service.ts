import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        idUsuario
        nombre
        apellido
        email
        roles {
          nombre
        }
      }
    }
  }
`;
