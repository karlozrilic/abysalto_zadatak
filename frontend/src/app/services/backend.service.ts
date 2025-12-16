import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

	getProducts(page: number, pageSize: number, sortField?: string | string[] | undefined, sortOrder?: number | null | undefined): Observable<{
		products: Product[],
		total: number,
        page: number,
        pageSize: number
	}> {
		let params = new HttpParams()
			.set('page', page.toString())
			.set('pageSize', pageSize.toString());

		if (sortField) {
			if (Array.isArray(sortField)) {
				sortField.forEach((field) => {
					params = params.set('sortField', field);
				})
			} else {
				params = params.set('sortField', sortField);
			}
		}

		if (sortOrder != null) {
			params = params.set('sortOrder', sortOrder.toString());
		}

		return this.http.get<{
			products: Product[],
			total: number,
			page: number,
			pageSize: number
		}>(`${this.apiUrl}/products`, { params });
	}

	/// For the purpose of this app user will always be guest with hardcoded uuid
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