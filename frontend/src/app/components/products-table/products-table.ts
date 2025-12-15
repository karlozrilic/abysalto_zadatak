import { Component, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating';
import { BackendService } from '../../services/backend.service';
import { CurrencyPipe } from '@angular/common';

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	images: string[]
}

@Component({
	selector: 'app-products-table',
	imports: [
		Button,
		TableModule,
		Tag,
		FormsModule,
		Rating,
		CurrencyPipe
	],
	templateUrl: './products-table.html',
	styleUrl: './products-table.css',
})
export class ProductsTable {
	loading = signal(false);
	products = signal<Product[]>([]);

	constructor(private backendService: BackendService) {}

	ngOnInit() {
		this.getProducts();
	}

	getSeverity(quantity: number) {
		if (quantity <= 20) {
			return 'warn';
		} else if (quantity > 20) {
			return 'success';
		} else {
			return 'danger';
		}
    }

	async addToCart(productId: number) {
		this.backendService.addToCart(productId).subscribe({
			next: (data) => {
				this.loading.set(false);
			},
			error: (err) => {
				this.loading.set(false);
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}

	async removeFromCart(productId: number) {
		this.backendService.removeFromCart(productId).subscribe({
			next: (data) => {
				this.loading.set(false);
			},
			error: (err) => {
				this.loading.set(false);
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}

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
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}
}
