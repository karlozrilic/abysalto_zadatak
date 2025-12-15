import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BackendService } from './services/backend.service';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string[]
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loading = signal(false);
  products = signal<Product[]>([]);

  constructor(private backendService: BackendService) {}

  ngOnInit() {}

  async getProducts() {
    this.loading.set(true);
    this.backendService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data.products);
        this.loading.set(false);
      },
      error: (err) => {
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }
}
