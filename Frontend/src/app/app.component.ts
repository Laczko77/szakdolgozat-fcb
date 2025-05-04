import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AnalyticsService } from '../shared/services/analytics.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'Frontend';
  


  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Google Analytics oldalletöltés
        this.analyticsService.sendPageView(event.urlAfterRedirects);

        // Scroll reset minden route váltáskor
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }
}
