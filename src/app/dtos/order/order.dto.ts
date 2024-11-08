import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber
} from 'class-validator';
import { CartItemDTO } from './cart.item.dto';

export class OrderDTO {
  user_id: number;

  fullname: string;

  email: string;

  phone_number: string;

  address: string;

  note: string;

  status: string;

  total_money: number;

  shipping_method: string;

  shipping_address: string;

  shipping_date: Date;

  payment_method: string;

  coupon_id: number;

  payment_id: number;

  cart_items: { product_id: number, quantity: number }[]; // Thêm cart_items để lưu thông tin giỏ hàng


  constructor(data: any) {
    this.user_id = data.user_id;
    this.fullname = data.fullname;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.note = data.note;
    this.status = data.status;
    this.total_money = data.total_money;
    this.shipping_method = data.shipping_method;
    this.shipping_address = data.shipping_address;
    this.shipping_date = data.shipping_date;
    this.payment_method = data.payment_method;
    this.coupon_id = data.coupon_id;
    this.payment_id = data.payment_id;
    this.cart_items = data.cart_items;
  }
}
