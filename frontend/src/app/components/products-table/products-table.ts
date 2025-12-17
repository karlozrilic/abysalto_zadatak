import { Component, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Product } from '../../models/product.model';
import { CartStore } from '../../store/cart.store';

@Component({
	selector: 'app-products-table',
	imports: [
		Button,
		TableModule,
		Tag,
		FormsModule,
		CurrencyPipe,
		Toast
	],
	templateUrl: './products-table.html',
	styleUrl: './products-table.css',
	providers: [MessageService]
})
export class ProductsTable {
	@ViewChild('productTable') table!: Table;
	loading = signal(false);
	products = signal<Product[]>([]);
	totalRecords = signal(0);
	rows = signal(10);
	sortField?: string;
	sortOrder?: number;

	constructor(
		private backendService: BackendService,
		public cartStore: CartStore,
		private messageService: MessageService
	) {}

	ngOnInit() {
		this.loadProducts({ first: 0, rows: this.rows() });;
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
		this.cartStore.addItem(
			productId,
			() => {
				this.loading.set(false);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart', life: 3000 });
			},
			() => {
				this.loading.set(false);
				this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was a problem', life: 3000 });
			}
		);
	}

	async removeFromCart(productId: number) {
		this.cartStore.removeItem(
			productId,
			() => {
				this.loading.set(false);
				this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product removed from cart', life: 3000 });
			},
			() => {
				this.loading.set(false);
				this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was a problem', life: 3000 });
			}
		);
	}

	loadProducts(event: TableLazyLoadEvent) {
		this.loading.set(true);

		const page = (event.first! / event.rows!) + 1;
		const pageSize = event.rows!;
		if (typeof event.sortField === 'string') {
			this.sortField = event.sortField;
		}
		
		if (typeof event.sortOrder === 'number') {
			this.sortOrder = event.sortOrder;
		}

		this.backendService.getProducts(page, pageSize, this.sortField, this.sortOrder).subscribe(res => {
			this.products.set(res.products);
			this.totalRecords.set(res.total);
			this.loading.set(false);
		});
	}

	refreshTable() {
		if (this.table) {
			this.loadProducts({
				first: this.table.first ?? undefined,
				rows: this.table.rows,
				sortField: this.sortField,
				sortOrder: this.sortOrder
			});
		}
	}
}
