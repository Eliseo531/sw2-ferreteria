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
        idRol
        nombre
      }
    }
  }
`;

const ROLES_QUERY = gql`
  query Roles {
    roles {
      idRol
      nombre
      descripcion
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      idUsuario
      nombre
      apellido
      email
      telefono
      estado
    }
  }
`;

const ASSIGN_ROLE_MUTATION = gql`
  mutation AssignRoleToUser($idUsuario: Int!, $idRol: Int!) {
    assignRoleToUser(idUsuario: $idUsuario, idRol: $idRol) {
      idUsuario
      nombre
      roles {
        idRol
        nombre
      }
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      idUsuario
      nombre
      apellido
      email
      telefono
      estado
      roles {
        idRol
        nombre
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apollo = inject(Apollo);

  getUsers() {
    return this.apollo.watchQuery<any>({
      query: USERS_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  getRoles() {
    return this.apollo.watchQuery<any>({
      query: ROLES_QUERY,
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createUser(input: any) {
    return this.apollo.mutate<any>({
      mutation: CREATE_USER_MUTATION,
      variables: { input },
    });
  }

  assignRoleToUser(idUsuario: number, idRol: number) {
    return this.apollo.mutate<any>({
      mutation: ASSIGN_ROLE_MUTATION,
      variables: { idUsuario, idRol },
    });
  }

  updateUser(input: any) {
    return this.apollo.mutate<any>({
      mutation: UPDATE_USER_MUTATION,
      variables: { input },
    });
  }
}
