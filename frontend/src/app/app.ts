import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { CartStore } from './store/cart.store';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		Header
	],
	templateUrl: './app.html',
	styleUrl: './app.css'
})
export class App {
	constructor(cartStore: CartStore) {
		cartStore.loadCart();
	}
}
