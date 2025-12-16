import { Component, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-cart',
    imports: [
        Button,
        TableModule,
        FormsModule,
        CurrencyPipe,
		Toast
    ],
    templateUrl: './cart.html',
    styleUrl: './cart.css',
	providers: [MessageService]
})
export class Cart {
	@ViewChild('cartTable') table!: Table;
    loading = signal(false);
    cartProducts = signal<Product[]>([]);

    constructor(
		private backendService: BackendService,
		private messageService: MessageService
	) {}

    ngOnInit() {
		this.getCart();
	}

    async addToCart(productId: number) {
		this.backendService.addToCart(productId).subscribe({
			next: (data) => {
				this.loading.set(false);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart', life: 3000 });
			},
			error: (err) => {
				this.loading.set(false);
				this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'There was a problem', life: 3000 });
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}

	async removeFromCart(productId: number) {
		this.backendService.removeFromCart(productId).subscribe({
			next: (data) => {
				this.getCart();
				this.loading.set(false);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product removed from cart', life: 3000 });
			},
			error: (err) => {
				this.loading.set(false);
				this.messageService.add({ severity: 'danger', summary: 'Error', detail: 'There was a problem', life: 3000 });
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}

    async getCart() {
		this.loading.set(true);
		this.backendService.getCart().subscribe({
			next: (data) => {
				this.cartProducts.set(data.products);
				this.loading.set(false);
			},
			error: (err) => {
				this.cartProducts.set([]);
				this.loading.set(false);
			},
			complete: () => {
				this.loading.set(false);
			}
		});
	}

	refreshTable() {
		if (this.table) {
			this.getCart();
		}
	}
}
