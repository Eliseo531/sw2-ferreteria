import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MlService } from '../../core/services/ml.service';
import { ProductService } from '../../core/services/product.service';
import { SaleService } from '../../core/services/sale.service';

@Component({
  selector: 'app-inventory-intelligence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-intelligence.html',
  styleUrl: './inventory-intelligence.css',
})
export class InventoryIntelligence {
  private mlService = inject(MlService);
  private productService = inject(ProductService);
  private saleService = inject(SaleService);

  loading = false;
  errorMessage = '';
  analysisResult: any = null;

  analyzeInventory() {
    this.loading = true;
    this.errorMessage = '';
    this.analysisResult = null;

    this.productService.getProducts().subscribe({
      next: (productResult) => {
        const products = productResult.data.products || [];

        this.saleService.getSales().subscribe({
          next: (saleResult) => {
            const sales = saleResult.data.sales || [];

            const mlProducts = products.map((product: any) => {
              const productSalesDetails = this.getProductSalesDetails(product.idProducto, sales);

              const monthlySales = this.calculateMonthlySales(product.idProducto, sales);
              const salesHistory = this.calculateSalesHistory(product.idProducto, sales);
              const stockRotation = this.calculateStockRotation(
                monthlySales,
                Number(product.stockActual),
              );

              return {
                product_name: product.nombre,
                current_stock: Number(product.stockActual),
                stock_minimum: Number(product.stockMinimo || 0),
                monthly_sales: monthlySales,
                stock_rotation: stockRotation,
                sales_history: salesHistory,
                total_sales_records: productSalesDetails.length,
              };
            });

            const validMlProducts = mlProducts.filter(
              (product: any) => product.sales_history.length >= 3,
            );

            if (validMlProducts.length === 0) {
              this.loading = false;
              this.errorMessage =
                'No hay suficientes ventas históricas para analizar inventario con Machine Learning.';
              return;
            }

            this.mlService.analyzeInventory({ products: validMlProducts }).subscribe({
              next: (result) => {
                this.analysisResult = result;
                this.loading = false;
              },
              error: (error) => {
                console.error('ERROR ML ANALYSIS:', error);
                this.loading = false;
                this.errorMessage =
                  'No se pudo procesar el análisis de inventario con Machine Learning.';
              },
            });
          },
          error: (error) => {
            console.error('ERROR SALES:', error);
            this.loading = false;
            this.errorMessage = 'No se pudieron cargar las ventas.';
          },
        });
      },
      error: (error) => {
        console.error('ERROR PRODUCTS:', error);
        this.loading = false;
        this.errorMessage = 'No se pudieron cargar los productos.';
      },
    });
  }

  private getProductSalesDetails(idProducto: number, sales: any[]) {
    return sales.flatMap((sale: any) =>
      (sale.detalles || []).filter(
        (detail: any) => Number(detail.idProducto) === Number(idProducto),
      ),
    );
  }

  private calculateMonthlySales(idProducto: number, sales: any[]) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0;

    for (const sale of sales) {
      const saleDate = new Date(sale.fechaVenta);

      if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
        for (const detail of sale.detalles || []) {
          if (Number(detail.idProducto) === Number(idProducto)) {
            total += Number(detail.cantidad);
          }
        }
      }
    }

    return total;
  }

  private calculateSalesHistory(idProducto: number, sales: any[]) {
    const now = new Date();
    const history: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      let monthlyTotal = 0;

      for (const sale of sales) {
        const saleDate = new Date(sale.fechaVenta);

        if (saleDate.getMonth() === targetMonth && saleDate.getFullYear() === targetYear) {
          for (const detail of sale.detalles || []) {
            if (Number(detail.idProducto) === Number(idProducto)) {
              monthlyTotal += Number(detail.cantidad);
            }
          }
        }
      }

      history.push(monthlyTotal);
    }

    return history;
  }

  private calculateStockRotation(monthlySales: number, currentStock: number) {
    if (monthlySales <= 0 && currentStock <= 0) {
      return 0;
    }

    const rotation = monthlySales / (monthlySales + currentStock);

    return Number(rotation.toFixed(2));
  }

  getPriorityClass(priority: string) {
    if (priority === 'ALTA') return 'priority-high';
    if (priority === 'MEDIA') return 'priority-medium';
    return 'priority-low';
  }
}
