import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionUtilityService {

  private subscriptions: Subscription[] = [];

  // Add a subscription to the utilities' array.
  public add(s: Subscription) {
    if (this.subscriptions) {
      this.subscriptions.push(s);
    }
  }
  
  // Unsubscribe from all subscriptions stored within this utility.
  unsubscribeAll() {
    if(this.subscriptions) {
      this.subscriptions.forEach((s)=> s.unsubscribe());
    }
  }
}
