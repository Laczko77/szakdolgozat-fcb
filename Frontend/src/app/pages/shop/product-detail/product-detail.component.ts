import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { Product } from '../product-admin/product-admin.component';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => this.product = product,
        error: (err) => console.error('Nem sikerült betölteni a terméket:', err)
      });
    }
  }

  addToCart(): void {
    if (this.product?._id) {
      this.cartService.addToCart(this.product._id, 1).subscribe({
        /*next: () => this.router.navigate(['/cart']),*/
        error: (err) => console.error('Hiba a kosárhoz adáskor:', err)
      });
    }
  }
}
