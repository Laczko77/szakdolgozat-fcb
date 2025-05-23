import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  username: string | null = '';
  cartItemCount: number = 0;
  hovered = false;
  menuOpen = false;
  isVisible = true;
  lastScrollTop = 0;
  scrollListener: any; 
  isReturning = false;
  isProductDetailPage: boolean = false;
  isProductDetail: boolean = false;
  firstTeamOpen = false;
  socialOpen = false;
  adminOpen = false;



  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // auth state
    this.authService.authStatus$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.isAdmin = this.authService.isAdmin();
      this.username = this.authService.getUsername();
    });

    // cart item count
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    // listen for route changes to detect product detail page
    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.isProductDetail =
        /^\/shop\/product\/[^\/]+$/.test(event.urlAfterRedirects) ||
        /^\/news\/[^\/]+$/.test(event.urlAfterRedirects);
      }
    });

    

    // scroll behavior (disabled on product detail page)
    this.scrollListener = () => {

      
      if (this.isProductDetail) {
        this.isVisible = true;
        this.isReturning = false;
        return;
      }
      

      if (this.isProductDetailPage) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > this.lastScrollTop) {
        this.isVisible = false;
        this.isReturning = false;
      } else {
        if (!this.isVisible) {
          this.isReturning = true;
          setTimeout(() => {
            if (!this.isProductDetailPage) {
              this.isReturning = false;
            }
          }, 1500);
        }
        this.isVisible = true;
      }

      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
