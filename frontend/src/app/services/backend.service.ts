import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

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

	getProducts(): Observable<{products: Product[]}> {
		return this.http.get<{ products: Product[] }>(`${this.apiUrl}/products`);
	}

	getCart(): Observable<{products: Product[]}>{
		return this.http.get<{ products: Product[] }>(`${this.apiUrl}/cart`, 
			{
				headers: {
					'X-Guest-ID': '550e8400-e29b-41d4-a716-446655440000'
				}
			}
		);
	}

	addToCart(productId: number): Observable<BasicResponse> {
		return this.http.post<BasicResponse>(`${this.apiUrl}/cart/add`, 
			{
				productId
			},
			{
				headers: {
					'X-Guest-ID': '550e8400-e29b-41d4-a716-446655440000'
				}
			}
		);
	}

  	removeFromCart(productId: number): Observable<BasicResponse> {
		return this.http.post<BasicResponse>(`${this.apiUrl}/cart/remove`,
			{
				productId
			},
			{
				headers: {
					'X-Guest-ID': '550e8400-e29b-41d4-a716-446655440000'
				}
			}
		);
  	}
}