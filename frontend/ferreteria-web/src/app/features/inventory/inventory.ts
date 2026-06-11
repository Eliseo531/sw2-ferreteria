import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);

  products: any[] = [];
  movements: any[] = [];
  alerts: any[] = [];

  loading = true;
  loadingMovements = true;
  loadingAlerts = true;

  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.loadInventory();
    this.loadMovements();
    this.loadAlerts();
  }

  loadInventory() {
    this.loading = true;

    this.inventoryService.getProductsStock().subscribe({
      next: (result) => {
        this.products = result.data.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR INVENTORY:', error);
        this.errorMessage = 'No se pudo cargar el inventario';
        this.loading = false;
      },
    });
  }

  loadMovements() {
    this.loadingMovements = true;

    this.inventoryService.getInventoryMovements().subscribe({
      next: (result) => {
        this.movements = result.data.inventoryMovements;
        this.loadingMovements = false;
      },
      error: (error) => {
        console.error('ERROR MOVEMENTS:', error);
        this.loadingMovements = false;
      },
    });
  }

  loadAlerts() {
    this.loadingAlerts = true;

    this.inventoryService.getPendingAlerts().subscribe({
      next: (result) => {
        this.alerts = result.data.pendingAlerts;
        this.loadingAlerts = false;
      },
      error: (error) => {
        console.error('ERROR ALERTS:', error);
        this.loadingAlerts = false;
      },
    });
  }

  getStockStatus(product: any) {
    if (product.stockActual <= 0) {
      return 'AGOTADO';
    }

    if (product.stockActual <= product.stockMinimo) {
      return 'STOCK_BAJO';
    }

    return 'NORMAL';
  }

  generateAlerts() {
    this.successMessage = '';
    this.errorMessage = '';

    this.inventoryService.generateStockAlerts().subscribe({
      next: (result) => {
        const total = result.data.generateStockAlerts.length;
        this.successMessage = `Se generaron ${total} alerta(s) de stock bajo`;
        this.loadAlerts();
      },
      error: (error) => {
        console.error('ERROR GENERATE ALERTS:', error);
        this.errorMessage = 'No se pudieron generar las alertas';
      },
    });
  }
}
