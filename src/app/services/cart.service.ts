import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {OktaAuthService} from "@okta/okta-angular";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  storage: Storage = localStorage;
  totalPrice

  constructor(private oktaAuthService: OktaAuthService,
              private httpClient: HttpClient) {
    }

  takeFromStorage() {
      let data = JSON.parse(this.storage.getItem("cartItems"));
      if (data != null) {
        this.cartItems = data;
      }
  }


  takeFromDataBase() {
      const accessToken: string = this.oktaAuthService.getAccessToken();
      let url: string = `http://localhost:8888/carts`;
      const headers = {
        'Authorization': 'Bearer ' + accessToken
      }
      return this.httpClient.get<any>(url, {'headers': headers});
  }
  takeCartDetailFromDatabase(){
    const accessToken: string = this.oktaAuthService.getAccessToken();
    let url: string = `http://localhost:8888/carts/cart-details`;
    const headers = {
      'Authorization': 'Bearer ' + accessToken
    }
    return this.httpClient.get<any>(url, {'headers': headers});
  }


  changeQuantity(url: string): any {
    console.log(url);
    let accessToken: string = this.oktaAuthService.getAccessToken();
    const headers = {
      'Authorization': 'Bearer ' + accessToken
    }
    return this.httpClient.post<any>(url, null, {'headers': headers});


  }

  addToCart(theCartItem: CartItem,productId:string) {
    let addUrl: string = `http://localhost:8888/carts/increment/${productId}`;
    this.changeQuantity(addUrl).subscribe(
      data => {
      }
    );
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
    this.persistCartItems();
  }

  // computeCartTotals() {
  //   let totalPriceValue: number = 0;
  //   let totalQuantityValue: number = 0;
  //   for (let currentCartItem of this.cartItems) {
  //     totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
  //     totalQuantityValue += currentCartItem.quantity;
  //   }
  //   this.totalPrice.next(totalPriceValue);
  //   this.totalQuantity.next(totalQuantityValue);
  //   // persist cart data
  //   this.persistCartItems();
  // }


  decrementQuantity(theCartItem: CartItem,productId:string) {
    let addUrl: string = `http://localhost:8888/carts/decrement/${productId}`;
    this.changeQuantity(addUrl).subscribe(
      data => {
      }
    )
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
      if (itemIndex > -1) {
        this.cartItems.splice(itemIndex, 1);
      }
      this.persistCartItems();
    }

  }

  remove(theCartItem: CartItem,productId:string) {
    let addUrl: string = `http://localhost:8888/carts/remove/${productId}`;
    this.changeQuantity(addUrl).subscribe(
      data=>{
        console.log(data);
      }
    );

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.persistCartItems();
    }
  }

  persistCartItems() {
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

}
