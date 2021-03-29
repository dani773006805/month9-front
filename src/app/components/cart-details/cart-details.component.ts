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
  constructor(private cartService: CartService,
              private productService: ProductService) {
  }

  ngOnInit(): void {
    this.listCartDetails();
    this.cartService.persistCartItems();
  }


  listCartDetails() {
    this.getCardDetail();
     this.cartService.takeFromDataBase().subscribe(
      data=>{
        this.cartItems=data;
      }
    );
  }
  getCardDetail(){
    this.cartService.takeCartDetailFromDatabase().subscribe(
      data=>{
        this.totalQuantity=data['totalQuantity'];
        this.totalPrice=data['totalPrice'];
      }
    )
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem,theCartItem.productId);
    this.listCartDetails();
    this.listCartDetails();
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem,theCartItem.productId);
    this.listCartDetails();
    this.listCartDetails();
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem,theCartItem.productId);
    this.listCartDetails();
    this.listCartDetails();
  }

}
