import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Luv2ShopFormService} from "../../services/luv2-shop-form.service";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {error} from "util";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  defaultMonth = new Date().getMonth();
  defaultYear = new Date().getFullYear();


  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  ngOnInit(): void {

    // this.reviewCartDetails();


    this.checkoutFormGroup = this.formBuilder.group({
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(3), Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl(this.defaultMonth),
        expirationYear: new FormControl(this.defaultYear),
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );


  }


  // private reviewCartDetails() {
  //
  //   // subscribe to cartService.totalQuantity
  //   this.cartService.totalQuantity.subscribe(
  //     totalQuantity => this.totalQuantity = totalQuantity
  //   );
  //
  //   // subscribe to cartService.totalPrice
  //   this.cartService.totalPrice.subscribe(
  //     totalPrice => this.totalPrice = totalPrice
  //   );
  // }


  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }


  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }


    const creditCard = this.checkoutFormGroup.controls['creditCard'].value;
    console.log(creditCard);


    this.checkoutService.placeOrder(creditCard).subscribe(
      {
        next: response => {
          this.resetCart();
        },
        error: err => {
          if (err.status === 201) {
            alert(`Your order has been received`)
            this.resetCart();
          } else {
            alert(`There was an error: ${err.message}`);
          }
        }
      }
    );
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }


}
