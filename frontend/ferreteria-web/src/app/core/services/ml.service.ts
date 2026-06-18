import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MlService {
  private http = inject(HttpClient);
  private apiUrl = 'https://sw2-ferreteria.duckdns.org/ai/ml';

  predictDemand(input: any) {
    return this.http.post<any>(`${this.apiUrl}/predict-demand`, input);
  }

  clusterProducts(input: any) {
    return this.http.post<any>(`${this.apiUrl}/cluster-products`, input);
  }

  recommendRestock(input: any) {
    return this.http.post<any>(`${this.apiUrl}/recommend-restock`, input);
  }
  analyzeInventory(input: any) {
    return this.http.post<any>(`${this.apiUrl}/analyze-inventory`, input);
  }
}
