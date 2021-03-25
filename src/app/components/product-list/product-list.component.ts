import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem} from 'src/app/common/cart-item';
import {OktaAuthService} from "@okta/okta-angular";
import {BehaviorSubject, Subject} from "rxjs";
import {isNumeric} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  checkNumber: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements = 0;

  isAuthenticated: boolean=false;


  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }
  checkAuthentication(){
    this.productService.isAuthenticated.subscribe(
      (result)=>{
        this.isAuthenticated=result;
      }
    )

  }


  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;

    this.checkNumber = isNumeric(theKeyword);
    if (this.checkNumber) {
      this.productService.searchProductsPaginateByPrice(this.thePageNumber - 1,
        this.thePageSize, +theKeyword).subscribe(
        data => {
          this.products = data['content'];
          this.thePageNumber = data['number'] + 1;
          this.thePageSize = data['size'];
          this.theTotalElements = data['totalElements'];
        }
      )
    } else {
      this.productService.searchProductsPaginateByNameAndDescription(this.thePageNumber - 1,
        this.thePageSize, theKeyword).subscribe(
        data => {
          this.products = data['content'];
          this.thePageNumber = data['number'] + 1;
          this.thePageSize = data['size'];
          this.theTotalElements = data['totalElements'];
        }
      )
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(
      data => {
        this.products = data['content'];
        this.thePageNumber = data['number'] + 1;
        this.thePageSize = data['size'];
        this.theTotalElements = data['totalElements'];
      }
    );
  }


  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
