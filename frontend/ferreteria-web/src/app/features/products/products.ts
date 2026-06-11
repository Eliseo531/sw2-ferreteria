import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private productService = inject(ProductService);

  products: any[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  form = {
    idCategoria: 1,
    idMarca: 1,
    idUnidad: 1,
    idUbicacion: 1,
    codigoBarras: '',
    nombre: '',
    descripcion: '',
    precioVenta: 0,
    precioCompraReferencia: 0,
    stockActual: 0,
    stockMinimo: 0,
  };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (result) => {
        this.products = result.data.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR PRODUCTS:', error);
        this.errorMessage = 'No se pudieron cargar los productos';
        this.loading = false;
      },
    });
  }

  createProduct() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.createProduct(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Producto creado correctamente';
        this.showForm = false;
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('ERROR CREATE PRODUCT:', error);
        this.saving = false;
        this.errorMessage = 'No se pudo crear el producto';
      },
    });
  }

  resetForm() {
    this.form = {
      idCategoria: 1,
      idMarca: 1,
      idUnidad: 1,
      idUbicacion: 1,
      codigoBarras: '',
      nombre: '',
      descripcion: '',
      precioVenta: 0,
      precioCompraReferencia: 0,
      stockActual: 0,
      stockMinimo: 0,
    };
  }
}
