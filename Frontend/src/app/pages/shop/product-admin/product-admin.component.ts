import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product.service';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss'],
  standalone: false
})
export class ProductAdminComponent implements OnInit {
  productForm: FormGroup;
  productList: Product[] = [];
  selectedProduct: Product | null = null;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => this.productList = products,
      error: (err) => console.error('Hiba a termékek betöltésekor:', err)
    });
  }

  selectForEdit(product: Product) {
    this.selectedProduct = product;
    this.productForm.patchValue(product);
  }

  clearForm() {
    this.selectedProduct = null;
    this.productForm.reset();
  }

  deleteProduct(id: string) {
    if (confirm('Biztosan törölni szeretnéd a terméket?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Hiba a termék törlésekor:', err)
      });
    }
  }

  submit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.selectedProduct) {
      // Frissítés
      this.productService.updateProduct(this.selectedProduct._id!, this.productForm.value).subscribe({
        next: () => {
          this.loadProducts();
          this.clearForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Hiba a termék frissítésekor:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // Új termék létrehozása
      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => {
          this.productForm.reset();
          this.loadProducts();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Hiba termék létrehozásakor:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}