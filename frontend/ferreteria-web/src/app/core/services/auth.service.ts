import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        idUsuario
        nombre
        apellido
        email
        estado
        roles {
          nombre
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apollo = inject(Apollo);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.apollo.mutate<any>({
      mutation: LOGIN_MUTATION,
      variables: {
        input: { email, password },
      },
    });
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRoles(): string[] {
    const user = this.getUser();
    return user?.roles?.map((r: any) => r.nombre) || [];
  }

  hasRole(roles: string[]) {
    const userRoles = this.getRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
