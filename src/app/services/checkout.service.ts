import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {CreditCard} from "../common/credit-card";
import {OktaAuthService} from "@okta/okta-angular";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:8888/orders/purchase';
  token: string=undefined;

  constructor(private httpClient: HttpClient,
              private oktaAuthService: OktaAuthService) {
    this.token=(this.oktaAuthService.getAccessToken());
  }

  placeOrder(theCreditCard: CreditCard): Observable<any> {
    this.token=this.oktaAuthService.getAccessToken();
    console.log(this.token);
    const headers = {
      'Authorization': 'Bearer ' + this.token
    }
    return this.httpClient.post<any>(this.purchaseUrl, theCreditCard, {'headers': headers});
  }
}
