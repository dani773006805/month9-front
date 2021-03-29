import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OktaAuthService} from "@okta/okta-angular";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderUrl = `http://localhost:8888/orders?page=0&size=100`;

  constructor(private httpClient: HttpClient,
              private oktaAuthService:OktaAuthService) {
  }

  getOrderHistory() {
    let token=this.oktaAuthService.getAccessToken();
    console.log(token);
    const headers = {
      'Authorization': 'Bearer ' + token
    }
    return this.httpClient.get<any>(this.orderUrl, {'headers': headers});

  }
}
