import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  isAuthenticated:boolean=false;

  constructor(private cartService: CartService,
              private productService:ProductService) {
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.listCartDetails();
  }
  checkAuthentication(){
    this.productService.isAuthenticated.subscribe(
      (result)=>{
        this.isAuthenticated=result;
      }
    )
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.cartService.computeCartTotals();
  }
  incrementQuantity(theCartItem:CartItem){
    this.cartService.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem:CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }
  remove(theCartItem:CartItem){
    this.cartService.remove(theCartItem);
  }

}
