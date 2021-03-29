import {Product} from "./product";

export class CartItem {
  id:string;
  name:string;
  imageUrl:string;
  unitPrice:number;
  quantity:number;
  productId:string;
  constructor(product:Product) {
    this.id=product.id;
    this.productId=product.id;
    this.name=product.name;
    this.imageUrl=product.imageUrl;
    this.unitPrice=product.unitPrice;
    this.quantity=1;

  // private Long id;
  // private String name;
  // private String description;
  // private BigDecimal unitPrice;
  // private Integer units;
  // private String imageUrl;
  // private Long cartId;
  }
}
