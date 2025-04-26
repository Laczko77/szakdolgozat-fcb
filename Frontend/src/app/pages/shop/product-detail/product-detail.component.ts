import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { Product } from '../product-admin/product-admin.component';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { PlayerService, Player } from '../../../../shared/services/player.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  players: Player[] = [];

  selectedSize: string = '';
  selectedPlayer: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private playerService: PlayerService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  onButtonClick() {
    this.analyticsService.sendButtonClick('Termék kosárba rakása');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
        
          if (this.product?._id && this.product?.name) {
            this.analyticsService.sendViewItem(this.product._id, this.product.name);
          }
        
          // ha "Mez" kategória, lehúzzuk a játékosokat is
          if (product.category === 'Mez') {
            this.loadPlayers();
          }
        },
        error: (err) => console.error('Nem sikerült betölteni a terméket:', err)
      });
    }
  }
  

  loadPlayers(): void {
    this.playerService.getAll().subscribe({
      next: (players) => {
        this.players = players.filter(player => player.position);
      },
      error: (err) => console.error('Hiba a játékosok betöltésekor:', err)
    });
  }

  addToCart(): void {
    if (this.product?._id) {
      // Ha nincs kiválasztva játékos, akkor ne küldjünk semmit (ne üres stringet!)
      const playerIdToSend = this.selectedPlayer || undefined;
  
      this.cartService.addToCart(this.product._id, 1, this.selectedSize, playerIdToSend)
        .subscribe({
          next: (res) => {
            console.log('✅ Sikeres kosárba rakás:', res);
          },
          error: (err) => console.error('❌ Hiba a kosárhoz adáskor:', err)
        });
    }
  }
  
  
}
