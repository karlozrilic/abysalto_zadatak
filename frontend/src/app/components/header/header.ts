import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Popover } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-header',
	imports: [
		RouterLink,
		MenubarModule,
        Popover,
		BadgeModule,
		Ripple,
		CommonModule
	],
	templateUrl: './header.html',
	styleUrl: './header.css',
})
export class Header {
	items: MenuItem[] | undefined;

	ngOnInit() {
		this.items = [
			{
				label: 'Home',
				icon: 'pi pi-home',
				routerLink: '/'
			}
		];

		var cart = [
			{
                label: 'Cart',
                icon: 'pi pi-shopping-cart',
                badge: '3',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
		]
	}
}
