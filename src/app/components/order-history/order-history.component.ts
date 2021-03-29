import {Component, OnInit} from '@angular/core';
import {Order} from "../../common/order";
import {OrderHistoryService} from "../../services/order-history.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    this.orderHistoryService.getOrderHistory().subscribe(
      data => {
        this.orders = data;
      }
    )
  }


}
