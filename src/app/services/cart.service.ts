import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";
import {OktaAuthService} from "@okta/okta-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  storage: Storage = sessionStorage;
  isAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);
  email: string = undefined;

  constructor(private oktaAuthService: OktaAuthService,
              private httpClient: HttpClient) {
    this.getUserDetails();
    this.takeFromStorage();

  }

  takeFromStorage() {
    if (this.isAuthenticated) {
      let data = JSON.parse(this.storage.getItem("cartItems"));
      if (data != null) {
        this.cartItems = data;
        this.computeCartTotals();
      }
    }
  }

  getUserDetails() {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated.next(result);
      }
    );
    this.oktaAuthService.getUser().then(
      resp => this.email = resp.email
    )

  }

  sendToBack(theCartItem: CartItem): any {
    let accessToken: string = this.oktaAuthService.getAccessToken();
    console.log(accessToken);
    const headers = {
      'Authorization': 'Bearer ' + accessToken,
      'Access-Control-Allow-Origin': '*'
    }
    let addUrl: string = `http://localhost:8888/carts/increment/${theCartItem.id}/${this.email}`;
    console.log(addUrl);
    return this.httpClient.post(addUrl, null, {'headers': headers});

  }

  addToCart(theCartItem: CartItem) {
    this.sendToBack(theCartItem).subscribe(data => {
      console.log(data);
    })

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;
    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // persist cart data
    this.persistCartItems();
  }


  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    this.getUserDetails();
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));

  }

}
