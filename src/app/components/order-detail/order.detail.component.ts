import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../enviroments/environment';
import { OrderDetail } from '../../models/order.detail';
import { OrderResponse } from '../../reponses/order/order.response';
import { CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OrderDetailComponent implements OnInit {

  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    trackingNumber: '',
    order_details: [] // Một mảng rỗng
  };

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
  ) { }
  ngOnInit(): void {
    debugger
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    const orderId = Number(idParam); // Thay bằng ID của đơn hàng bạn muốn lấy.
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        debugger;
        this.orderResponse.id = response.items.id;
        this.orderResponse.user_id = response.items.user_id;
        this.orderResponse.fullname = response.items.fullname;
        this.orderResponse.email = response.items.email;
        this.orderResponse.phone_number = response.items.phone_number;
        this.orderResponse.address = response.items.address;
        this.orderResponse.note = response.items.note;
        this.orderResponse.order_date = new Date(
          response.items.order_date[0],
          response.items.order_date[1] - 1,
          response.items.order_date[2]
        );

        this.orderResponse.order_details = response.items.order_details
          .map((order_detail: OrderDetail) => {
            order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
            return order_detail;
          });
        this.orderResponse.payment_method = response.items.payment_method;
        this.orderResponse.trackingNumber = response.items.trackingNumber;
        this.orderResponse.shipping_date = new Date(
          response.items.shipping_date[0],
          response.items.shipping_date[1] - 1,
          response.items.shipping_date[2]
        );
        this.orderResponse.shipping_address = response.items.shipping_address;
        this.orderResponse.shipping_method = response.items.shipping_method;
        this.orderResponse.status = response.items.status;
        this.orderResponse.total_money = response.items.total_money;

      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }



}
