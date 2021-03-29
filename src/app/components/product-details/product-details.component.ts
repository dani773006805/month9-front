import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";
import {ReviewServiceService} from "../../services/review-service.service";
import {Review} from "../../common/review";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  reviews:Review[]=[];
  product: Product = new Product();
  productId:string=undefined;
  isAuthenticated: boolean = false;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private reviewService:ReviewServiceService) {
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
    this.handleReviews();
  }

  checkAuthentication() {
    this.productService.isAuthenticated.subscribe(
      (result)=>{
        this.isAuthenticated=result;
      }
    )
  }

  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id');
    this.productId=theProductId.toString();
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }
  handleReviews(){
    this.reviewService.getReviews(this.productId).subscribe(
      data=>{
        this.reviews=data['content'];
        console.log(this.reviews);

      }
    )
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    let cartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem,cartItem.productId);
  }

}
