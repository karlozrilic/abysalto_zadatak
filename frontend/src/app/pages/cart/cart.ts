import { Component, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { CartStore } from '../../store/cart.store';

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

    constructor(
		public cartStore: CartStore,
		private messageService: MessageService
	) {}

    async addToCart(productId: number) {
		this.cartStore.addItem(
			productId,
			() => {
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart', life: 3000 });
			},
			() => {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was a problem', life: 3000 });
			}
		);
	}

	async removeFromCart(productId: number) {
		this.cartStore.removeItem(
			productId,
			() => {
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product removed from cart', life: 3000 });
			},
			() => {
				this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was a problem', life: 3000 });
			}
		);
	}

	refreshTable() {
		if (this.table) {
			this.cartStore.loadCart();
		}
	}
}
