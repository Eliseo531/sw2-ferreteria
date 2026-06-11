import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);

  orders: any[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  form = {
    idCliente: 1,
    idUsuarioRegistro: 1,
    origen: 'WHATSAPP',
    observacion: '',
    detalles: [
      {
        idProducto: 1,
        cantidad: 1,
        precioEstimado: 0,
      },
    ],
  };

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    this.orderService.getOrders().subscribe({
      next: (result) => {
        this.orders = result.data.orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR ORDERS:', error);
        this.errorMessage = 'No se pudieron cargar los pedidos';
        this.loading = false;
      },
    });
  }

  createOrder() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.orderService.createOrder(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Pedido registrado correctamente';
        this.showForm = false;
        this.resetForm();
        this.loadOrders();
      },
      error: (error) => {
        console.error('ERROR CREATE ORDER:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo registrar el pedido';
      },
    });
  }

  updateStatus(idPedido: number, estado: string) {
    this.orderService
      .updateOrderStatus({
        idPedido,
        estado,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Estado actualizado correctamente';
          this.loadOrders();
        },
        error: (error) => {
          console.error('ERROR UPDATE ORDER:', error);
          this.errorMessage = 'No se pudo actualizar el estado del pedido';
        },
      });
  }

  resetForm() {
    this.form = {
      idCliente: 1,
      idUsuarioRegistro: 1,
      origen: 'WHATSAPP',
      observacion: '',
      detalles: [
        {
          idProducto: 1,
          cantidad: 1,
          precioEstimado: 0,
        },
      ],
    };
  }
}
