import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{products: []}> {
    return this.http.get<{ products: [] }>(`${this.apiUrl}/products`);
  }
}