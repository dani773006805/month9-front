import {OrderItem} from "./order-item";

export class Order {
  private id: number;
  totalQuantity: number;
  totalPrice: number;
  dateCreated: string;
  private orderItems: OrderItem[];
}
