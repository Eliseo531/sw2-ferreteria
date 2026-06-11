import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  private customerService = inject(CustomerService);

  customers: any[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  form = {
    nombre: '',
    apellido: '',
    nitCi: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoCliente: 'MINORISTA',
  };

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;

    this.customerService.getCustomers().subscribe({
      next: (result) => {
        this.customers = result.data.customers;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR CUSTOMERS:', error);
        this.errorMessage = 'No se pudieron cargar los clientes';
        this.loading = false;
      },
    });
  }

  createCustomer() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.customerService.createCustomer(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Cliente creado correctamente';
        this.showForm = false;
        this.resetForm();
        this.loadCustomers();
      },
      error: (error) => {
        console.error('ERROR CREATE CUSTOMER:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo crear el cliente';
      },
    });
  }

  resetForm() {
    this.form = {
      nombre: '',
      apellido: '',
      nitCi: '',
      telefono: '',
      email: '',
      direccion: '',
      tipoCliente: 'MINORISTA',
    };
  }
}
