import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";
import {OktaAuthService} from "@okta/okta-angular";

@Injectable
({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8888';
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,
              private oktaAuthService: OktaAuthService) {
    this.checkAuthentication();

  }

  checkAuthentication() {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated.next(result);
      }
    )
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number) {
    const searchUrl = `${this.baseUrl}/shop/product-category/${theCategoryId}/products?` +
      `page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/shop/product-category/${theCategoryId}/products`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = `${this.baseUrl}/shop/product-category`;

    return this.httpClient.get<GetResponseProductCategory>(searchUrl).pipe(
      map(response => response.content)
    )
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    console.log('service ' + theKeyword);
    const searchUrl = `${this.baseUrl}/shop/products/findByName/${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword: string) {
    const searchUrl = `${this.baseUrl}/shop/products/findByName/${theKeyword}?` +
      `page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get(searchUrl);
  }

  searchProductsPaginateByPrice(thePage: number,
                                thePageSize: number,
                                thePrice: number) {
    const searchUrl = `${this.baseUrl}/shop/products/findByPrice/${thePrice}?` +
      `page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get(searchUrl);
  }

  searchProductsPaginateByNameAndDescription(thePage: number,
                                             thePageSize: number,
                                             theKeyword: string) {
    const searchUrl = `${this.baseUrl}/shop/products/findByNameAndDescriptionContaining/${theKeyword}?` +
      `page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response.content)
    )
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/shop/products/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

}

interface GetResponseProductCategory {
  content: ProductCategory[];

}

interface GetResponseProducts {
  content: Product[];

}
