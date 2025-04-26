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
  constructor(
    private router: Router,
    private analyticsService: AnalyticsService // injektáljuk
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.analyticsService.sendPageView(event.urlAfterRedirects);
      }
    });
  }
}
