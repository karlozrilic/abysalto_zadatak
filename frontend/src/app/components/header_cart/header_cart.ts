import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';
import { DataView } from 'primeng/dataview';

@Component({
	selector: 'app-header-cart',
	imports: [
		RouterLink,
		Ripple,
		CommonModule,
		DataView
	],
	templateUrl: './header_cart.html',
	styleUrl: './header_cart.css',
})
export class HeaderCart {
	items: MenuItem[] | undefined;

	constructor(public cartStore: CartStore) {}
}
