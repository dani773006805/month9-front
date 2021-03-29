import { Injectable } from '@angular/core';
import {OktaAuthService} from "@okta/okta-angular";
import {HttpClient} from "@angular/common/http";
import {Review} from "../common/review";

@Injectable({
  providedIn: 'root'
})
export class ReviewServiceService {

  constructor(private oktaAuthService: OktaAuthService,
              private httpClient: HttpClient) { }
  postReview(review:Review): any {
    let url:string=`http://localhost:8888/reviews/${review.productId}`;
    let accessToken: string = this.oktaAuthService.getAccessToken();
    const headers = {
      'Authorization': 'Bearer ' + accessToken
    }
    return this.httpClient.post<any>(url, review, {'headers': headers});

  }
  getReviews(theProductId:string){
    let url:string=`http://localhost:8888/reviews/products/${theProductId}?page=0&size=100`;
    return this.httpClient.get(url);
  }
}
