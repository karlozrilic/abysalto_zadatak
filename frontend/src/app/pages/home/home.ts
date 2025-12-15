import { Component } from '@angular/core';
import { ProductsTable } from '../../components/products-table/products-table';

@Component({
  selector: 'app-home',
  imports: [
    ProductsTable
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
}
