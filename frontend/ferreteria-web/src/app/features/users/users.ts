import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private userService = inject(UserService);

  users: any[] = [];
  roles: any[] = [];

  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  editing = false;
  editingUserId: number | null = null;
  form = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    idRol: 1,
  };

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.loading = true;

    this.userService.getUsers().subscribe({
      next: (result) => {
        this.users = result.data.users;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR USERS:', error);
        this.errorMessage = 'No se pudieron cargar los usuarios';
        this.loading = false;
      },
    });
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (result) => {
        this.roles = result.data.roles;
      },
      error: (error) => {
        console.error('ERROR ROLES:', error);
      },
    });
  }

  createUser() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { idRol, ...userInput } = this.form;

    this.userService.createUser(userInput).subscribe({
      next: (result) => {
        const idUsuario = result.data.createUser.idUsuario;

        this.userService.assignRoleToUser(idUsuario, idRol).subscribe({
          next: () => {
            this.saving = false;
            this.successMessage = 'Usuario creado y rol asignado correctamente';
            this.showForm = false;
            this.resetForm();
            this.loadUsers();
          },
          error: (error) => {
            console.error('ERROR ASSIGN ROLE:', error);
            this.saving = false;
            this.errorMessage = 'Usuario creado, pero no se pudo asignar el rol';
          },
        });
      },
      error: (error) => {
        console.error('ERROR CREATE USER:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo crear el usuario';
      },
    });
  }
  editUser(user: any) {
    this.showForm = true;
    this.editing = true;
    this.editingUserId = user.idUsuario;

    this.form = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      password: '',
      telefono: user.telefono || '',
      idRol: user.roles?.[0]?.idRol || 1,
    };
  }
  updateUser() {
    if (!this.editingUserId) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const input: any = {
      idUsuario: this.editingUserId,
      nombre: this.form.nombre,
      apellido: this.form.apellido,
      email: this.form.email,
      telefono: this.form.telefono,
    };

    this.userService.updateUser(input).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Usuario actualizado correctamente';
        this.showForm = false;
        this.editing = false;
        this.editingUserId = null;
        this.resetForm();
        this.loadUsers();
      },
      error: (error) => {
        console.error('ERROR UPDATE USER:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo actualizar el usuario';
      },
    });
  }

  resetForm() {
    this.form = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      idRol: 1,
    };

    this.editing = false;
    this.editingUserId = null;
  }
}
