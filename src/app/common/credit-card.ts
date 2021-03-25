import {FormControl, Validators} from "@angular/forms";
import {Luv2ShopValidators} from "../validators/luv2-shop-validators";

export class CreditCard {
  id: number;
  cardType: string;
  nameOnCard: string;
  cardNumber: string;
  securityCode: string;
  expirationMonth: number;
  expirationYear: number;
}
