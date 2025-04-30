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
  searchTerm: string = '';
  selectedFile: File | null = null; // ÚJ: fájl mentése

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      imageUrl: ['']
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
    this.selectedFile = null;
  }

  deleteProduct(id: string) {
    if (confirm('Biztosan törölni szeretnéd a terméket?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Hiba a termék törlésekor:', err)
      });
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submit() {
    console.log('Submit elindult'); // ideiglenes log
  
    if (this.productForm.invalid) {
      console.log('Form invalid'); // ideiglenes log
      this.productForm.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
  
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value.toString());
    formData.append('category', this.productForm.get('category')?.value);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    if (this.selectedProduct) {
      console.log('Frissítés történik');
      this.productService.updateProduct(this.selectedProduct._id!, formData).subscribe({
        next: (res) => {
          console.log('Sikeres frissítés', res);
          this.loadProducts();
          this.clearForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Hiba frissítéskor:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      console.log('Új termék létrehozása');
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          console.log('Sikeres mentés', res);
          this.productForm.reset();
          this.selectedFile = null;
          this.loadProducts();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Hiba létrehozáskor:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
  
  

  filteredProducts(): Product[] {
    return this.productList.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  edit(product: Product) {
    this.selectedProduct = product;
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category
    });

    setTimeout(() => {
      document.getElementById('productForm')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
