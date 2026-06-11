import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeliveryService } from '../../core/services/delivery.service';
import { UserService } from '../../core/services/user.service';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deliveries.html',
  styleUrl: './deliveries.css',
})
export class Deliveries implements OnInit {
  private deliveryService = inject(DeliveryService);
  private userService = inject(UserService);
  private documentService = inject(DocumentService);

  deliveries: any[] = [];
  repartidores: any[] = [];

  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  form = {
    idPedido: 1,
    idRepartidor: 1,
    direccionEntrega: '',
    latitudEntrega: -17.7833,
    longitudEntrega: -63.1821,
    observacion: '',
  };

  assignForm = {
    idEntrega: 1,
    idRepartidor: 1,
  };

  ngOnInit() {
    this.loadDeliveries();
    this.loadRepartidores();
  }

  loadDeliveries() {
    this.loading = true;

    this.deliveryService.getDeliveries().subscribe({
      next: (result) => {
        this.deliveries = result.data.deliveries;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR DELIVERIES:', error);
        this.errorMessage = 'No se pudieron cargar las entregas';
        this.loading = false;
      },
    });
  }

  loadRepartidores() {
    this.userService.getUsers().subscribe({
      next: (result) => {
        const users = result.data.users || [];

        this.repartidores = users.filter((user: any) =>
          user.roles?.some((role: any) => role.nombre === 'REPARTIDOR'),
        );
      },
      error: (error) => {
        console.error('ERROR LOAD REPARTIDORES:', error);
        this.errorMessage = 'No se pudieron cargar los repartidores';
      },
    });
  }

  createDelivery() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.deliveryService.createDelivery(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Entrega registrada correctamente';
        this.showForm = false;
        this.resetForm();
        this.loadDeliveries();
      },
      error: (error) => {
        console.error('ERROR CREATE DELIVERY:', error);
        this.saving = false;
        this.errorMessage =
          'No se pudo registrar la entrega. Revisa que el pedido exista y no tenga entrega.';
      },
    });
  }

  assignDriver(idEntrega: number, idRepartidor: number) {
    this.deliveryService
      .assignDriver({
        idEntrega,
        idRepartidor,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Repartidor asignado correctamente';
          this.loadDeliveries();
        },
        error: (error) => {
          console.error('ERROR ASSIGN DRIVER:', error);
          this.errorMessage = 'No se pudo asignar el repartidor';
        },
      });
  }

  getRepartidorName(idRepartidor: number) {
    const repartidor = this.repartidores.find(
      (user: any) => Number(user.idUsuario) === Number(idRepartidor),
    );

    return repartidor ? `${repartidor.nombre} ${repartidor.apellido}` : idRepartidor || '-';
  }

  viewEvidence(idEntrega: number) {
    this.documentService.getDocumentsByRelated('ENTREGA', idEntrega).subscribe({
      next: (result) => {
        const documents = result.documents || [];

        if (documents.length === 0) {
          alert('Esta entrega no tiene evidencias registradas.');
          return;
        }

        const evidence = documents[0];

        if (evidence.url_temporal) {
          window.open(evidence.url_temporal, '_blank');
        } else {
          alert('No se pudo obtener la URL temporal de la evidencia.');
        }
      },
      error: (error) => {
        console.error('ERROR VIEW EVIDENCE:', error);
        alert('No se pudo cargar la evidencia de la entrega.');
      },
    });
  }

  updateStatus(idEntrega: number, estado: string) {
    this.deliveryService
      .updateStatus({
        idEntrega,
        estado,
        latitudEntrega: -17.7833,
        longitudEntrega: -63.1821,
        observacion: `Estado actualizado a ${estado}`,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Estado de entrega actualizado correctamente';
          this.loadDeliveries();
        },
        error: (error) => {
          console.error('ERROR UPDATE DELIVERY:', error);
          this.errorMessage = 'No se pudo actualizar el estado de la entrega';
        },
      });
  }

  resetForm() {
    this.form = {
      idPedido: 1,
      idRepartidor: 1,
      direccionEntrega: '',
      latitudEntrega: -17.7833,
      longitudEntrega: -63.1821,
      observacion: '',
    };
  }
}
