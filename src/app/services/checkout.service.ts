import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreditCard} from "../common/credit-card";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase'

  constructor(private httpClient: HttpClient) {
  }

  placeOrder(theCreditCard:CreditCard): Observable<any> {
    return this.httpClient.post<CreditCard>(this.purchaseUrl, theCreditCard);
  }
}
