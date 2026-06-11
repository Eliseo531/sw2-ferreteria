import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://167.172.134.57:8002/ai';

  classifyProduct(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/classify-product`, formData);
  }

  predictDemand(productId: number) {
    return this.http.get<any>(`${this.apiUrl}/predict-demand/${productId}`);
  }

  segmentCustomer(customerId: number) {
    return this.http.get<any>(`${this.apiUrl}/segment-customer/${customerId}`);
  }
}
