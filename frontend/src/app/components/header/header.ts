import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Popover } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';
import { HeaderCart } from '../header_cart/header_cart';

@Component({
	selector: 'app-header',
	imports: [
		RouterLink,
		MenubarModule,
        Popover,
		BadgeModule,
		Ripple,
		CommonModule,
		HeaderCart
	],
	templateUrl: './header.html',
	styleUrl: './header.css',
})
export class Header {
	@ViewChild('cartMenu') cartMenu!: Popover;
	items: MenuItem[] | undefined;

	constructor(public cartStore: CartStore) {}

	ngOnInit() {
		this.items = [
			{
				label: 'Home',
				icon: 'pi pi-home',
				routerLink: '/'
			}
		];
	}

	toggleCart(event: MouseEvent) {
		event.preventDefault();
		this.cartMenu.toggle(event);
	}
}
