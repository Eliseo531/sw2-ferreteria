import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  private documentService = inject(DocumentService);

  documents: any[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;

  selectedFile: File | null = null;

  form = {
    nombre: '',
    tipoDocumento: 'MANUAL_TECNICO',
    relatedType: 'PRODUCTO',
    relatedId: 1,
    fechaVencimiento: '',
  };

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;

    this.documentService.getDocuments().subscribe({
      next: (result) => {
        this.documents = result.data.documents;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR DOCUMENTS:', error);
        this.errorMessage = 'No se pudieron cargar los documentos';
        this.loading = false;
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadAndRegisterDocument() {
    if (!this.selectedFile) {
      this.errorMessage = 'Debes seleccionar un archivo';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.documentService
      .uploadFile(
        this.selectedFile,
        this.form.tipoDocumento,
        this.form.relatedType,
        this.form.relatedId,
      )
      .subscribe({
        next: (uploadResult) => {
          const objectKey = uploadResult.metadata.object_key;

          const input: any = {
            nombre: this.form.nombre || this.selectedFile?.name,
            tipoDocumento: this.form.tipoDocumento,
            urlArchivo: objectKey,
            fechaVencimiento: this.form.fechaVencimiento || null,
          };

          if (this.form.relatedType === 'PRODUCTO') {
            input.idProducto = this.form.relatedId;
          }

          if (this.form.relatedType === 'PROVEEDOR') {
            input.idProveedor = this.form.relatedId;
          }

          this.documentService.createDocument(input).subscribe({
            next: () => {
              this.saving = false;
              this.successMessage = 'Documento subido y registrado correctamente';
              this.showForm = false;
              this.resetForm();
              this.loadDocuments();
            },
            error: (error) => {
              console.error('ERROR CREATE DOCUMENT:', error);
              this.saving = false;
              this.errorMessage = 'El archivo se subió, pero no se pudo registrar en el ERP';
            },
          });
        },
        error: (error) => {
          console.error('ERROR UPLOAD DOCUMENT:', error);
          this.saving = false;
          this.errorMessage = 'No se pudo subir el archivo al Document Service';
        },
      });
  }

  resetForm() {
    this.selectedFile = null;

    this.form = {
      nombre: '',
      tipoDocumento: 'MANUAL_TECNICO',
      relatedType: 'PRODUCTO',
      relatedId: 1,
      fechaVencimiento: '',
    };
  }
}
