import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../core/services/purchase.service';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchases.html',
  styleUrl: './purchases.css',
})
export class Purchases implements OnInit {
  private purchaseService = inject(PurchaseService);

  purchases: any[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  form = {
    idProveedor: 1,
    idUsuario: 1,
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
    this.loadPurchases();
  }

  loadPurchases() {
    this.loading = true;

    this.purchaseService.getPurchases().subscribe({
      next: (result) => {
        this.purchases = result.data.purchases;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR PURCHASES:', error);
        this.errorMessage = 'No se pudieron cargar las compras';
        this.loading = false;
      },
    });
  }

  createPurchase() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.purchaseService.createPurchase(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Compra registrada correctamente';
        this.showForm = false;
        this.resetForm();
        this.loadPurchases();
      },
      error: (error) => {
        console.error('ERROR CREATE PURCHASE:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo registrar la compra. Revisa proveedor, producto o datos.';
      },
    });
  }

  resetForm() {
    this.form = {
      idProveedor: 1,
      idUsuario: 1,
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
