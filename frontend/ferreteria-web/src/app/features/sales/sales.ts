import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../core/services/sale.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales implements OnInit {
  private saleService = inject(SaleService);

  sales: any[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  form = {
    idCliente: 1,
    idUsuario: 1,
    metodoPago: 'EFECTIVO',
    observacion: '',
    detalles: [
      {
        idProducto: 1,
        cantidad: 1,
        precioUnitario: 0,
      },
    ],
  };

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;

    this.saleService.getSales().subscribe({
      next: (result) => {
        this.sales = result.data.sales;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR SALES:', error);
        this.errorMessage = 'No se pudieron cargar las ventas';
        this.loading = false;
      },
    });
  }

  createSale() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.saleService.createSale(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Venta registrada correctamente';
        this.showForm = false;
        this.resetForm();
        this.loadSales();
      },
      error: (error) => {
        console.error('ERROR CREATE SALE:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo registrar la venta. Revisa stock, cliente o producto.';
      },
    });
  }

  resetForm() {
    this.form = {
      idCliente: 1,
      idUsuario: 1,
      metodoPago: 'EFECTIVO',
      observacion: '',
      detalles: [
        {
          idProducto: 1,
          cantidad: 1,
          precioUnitario: 0,
        },
      ],
    };
  }
}
