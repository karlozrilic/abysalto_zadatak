import { Injectable, signal, computed } from '@angular/core';
import { Cart } from '../models/cart.model';
import { BackendService } from '../services/backend.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStore {
    private readonly _cart = signal<Cart | null>(null);
    private readonly _loading = signal(false);

    readonly cart = computed(() => this._cart());
    readonly items = computed(() => this._cart()?.products ?? []);
    readonly totalPrice = computed(() => this._cart()?.total ?? 0);
    readonly loading = computed(() => this._loading());

    constructor(private backendService: BackendService) {}

    loadCart() {
        this._loading.set(true);
        this.backendService.getCart()
            .pipe(tap(() => this._loading.set(false)))
            .subscribe({
                next: cart => this._cart.set(cart),
                error: () => this._loading.set(false)
            });
    }

    addItem(productId: number, onNext: Function, onError: Function) {
        this._loading.set(true);
        this.backendService.addToCart(productId)
            .subscribe({
                next: cart => {
                    this._cart.set(cart);
                    this._loading.set(false);
                    onNext();
                },
                error: () => {
                    this._loading.set(false);
                    onError();
                }
            });
    }

    removeItem(cartItemId: number, onNext: Function, onError: Function) {
        this._loading.set(true);
        this.backendService.removeFromCart(cartItemId)
            .subscribe({
                next: cart => {
                    this._cart.set(cart);
                    this._loading.set(false);
                    onNext();
                },
                error: () => {
                    this._loading.set(false);
                    onError();
                }
            });
    }

    clearCart() {
        this._cart.set(null);
    }
}