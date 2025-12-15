import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BasicResponse {
  status: number,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{products: []}> {
    return this.http.get<{ products: [] }>(`${this.apiUrl}/products`);
  }

  getCart(): Observable<{products: []}>{
    return this.http.get<{ products: [] }>(`${this.apiUrl}/cart`, 
      {
        headers: {
          'X-Guest-ID': '3-123-12d1'
        }
      }
    );
  }

  addToCart(productId: number): Observable<BasicResponse> {
    return this.http.post<BasicResponse>(`${this.apiUrl}/cart/add`, 
      {
        productId
      }
    );
  }

  removeFromCart(productId: number): Observable<BasicResponse> {
    return this.http.post<BasicResponse>(`${this.apiUrl}/cart/remove`,
      {
        productId
      }
    );
  }
}