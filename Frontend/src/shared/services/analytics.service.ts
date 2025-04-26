import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {}

  sendPageView(url: string) {
    gtag('event', 'page_view', {
      page_path: url
    });
  }

  sendButtonClick(actionName: string) {
    gtag('event', 'button_click', {
      event_category: 'Button',
      event_label: actionName
    });
  }

  sendViewItem(itemId: string, itemName: string) {
    gtag('event', 'view_item', {
      item_id: itemId,
      item_name: itemName
    });
  }
}
