import { Routes } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'cart',
        component: Cart,
    },
];
