import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: false
})
export class ShopComponent implements OnInit, AfterViewInit {

  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;
  @ViewChild('productSection') productSection!: ElementRef;
  

  products: Product[] = [];
  filteredProducts = this.products;
  searchQuery = '';
  currentPage = 1;
  productsPerPage = 8;
  selectedCategory: string = '';

  constructor(private productService: ProductService) {}



  ngOnInit(): void {
    this.loadProducts();
    this.filteredProducts = this.products;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
        
      });
    }, {
      threshold: 0.08
    });

    this.fadeElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      elements.forEach((el) => observer.observe(el.nativeElement));
    });

    // Azonnal is lefuttatjuk, ha már van elem
    this.fadeElements.forEach((el) => observer.observe(el.nativeElement));
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    const category = this.selectedCategory;
  
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(query) &&
      (category === '' || p.category === category)
    );
  
    this.currentPage = 1;
  }
  
  

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error('Hiba a termékek betöltésekor:', err)
    });
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.productsPerPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;

      // Görgetés a termék szekció tetejére
      this.productSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  
}
