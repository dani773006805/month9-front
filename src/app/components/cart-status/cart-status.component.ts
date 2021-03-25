import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {OktaAuthService} from "@okta/okta-angular";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  isAuthenticated: boolean;

  constructor(private cartService: CartService,
              private productService: ProductService) {
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.updateCartStatus();
  }

  checkAuthentication() {
    this.productService.isAuthenticated.subscribe(
      (data) => {
        this.isAuthenticated = data;
      }
    );
  }


  updateCartStatus() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
