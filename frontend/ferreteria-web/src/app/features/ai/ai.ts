import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/services/ai.service';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai.html',
  styleUrl: './ai.css',
})
export class Ai {
  private aiService = inject(AiService);

  selectedFile: File | null = null;

  productId = 1;
  customerId = 1;

  imageResult: any = null;
  demandResult: any = null;
  segmentResult: any = null;

  loadingImage = false;
  loadingDemand = false;
  loadingSegment = false;

  errorMessage = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  classifyProduct() {
    if (!this.selectedFile) {
      this.errorMessage = 'Selecciona una imagen primero';
      return;
    }

    this.loadingImage = true;
    this.errorMessage = '';
    this.imageResult = null;

    this.aiService.classifyProduct(this.selectedFile).subscribe({
      next: (result) => {
        this.imageResult = result;
        this.loadingImage = false;
      },
      error: (error) => {
        console.error('ERROR IA IMAGE:', error);
        this.errorMessage = 'No se pudo clasificar la imagen';
        this.loadingImage = false;
      },
    });
  }

  predictDemand() {
    this.loadingDemand = true;
    this.demandResult = null;
    this.errorMessage = '';

    this.aiService.predictDemand(this.productId).subscribe({
      next: (result) => {
        this.demandResult = result;
        this.loadingDemand = false;
      },
      error: (error) => {
        console.error('ERROR IA DEMAND:', error);
        this.errorMessage = 'No se pudo predecir la demanda';
        this.loadingDemand = false;
      },
    });
  }

  segmentCustomer() {
    this.loadingSegment = true;
    this.segmentResult = null;
    this.errorMessage = '';

    this.aiService.segmentCustomer(this.customerId).subscribe({
      next: (result) => {
        this.segmentResult = result;
        this.loadingSegment = false;
      },
      error: (error) => {
        console.error('ERROR IA SEGMENT:', error);
        this.errorMessage = 'No se pudo segmentar el cliente';
        this.loadingSegment = false;
      },
    });
  }
}
