import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDTO } from '../../../dtos/order/order.dto';
import { environment } from '../../../enviroments/environment';
import { OrderResponse } from '../../../reponses/order/order.response';
import { OrderService } from '../../../service/order.service';

import { CommonModule } from '@angular/common';
import { CouponService } from '../../../service/coupon.service';
import { OrderUpdateResponse } from '../../../reponses/order/orderUpdate.response';
import { OrderUpdateDTO } from '../../../dtos/order/orderUpdate.dto';

@Component({
  selector: 'app-order-detail-admin',
  templateUrl: './order-detail.admin.component.html',
  styleUrls: ['./order-detail.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class OrderDetailAdminComponent implements OnInit {
  orderId?: number = 0;
  timezone: string = 'Asia/Ho_Chi_Minh';
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    coupon_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    trackingNumber: '',
    order_details: [],
  };
  orderUpdateResponse: OrderUpdateResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    trackingNumber: '',
    order_details: [],
  };
  couponCode: String = '';
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private couponService: CouponService
  ) {
  }
  ngOnInit(): void {
    this.getOrderDtail();
  }
  getOrderDtail(): void {
    debugger
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        debugger
        const dateString = this.orderService.convertToISODate(response.items.shipping_date, this.timezone);
        this.orderResponse = {
          ...response.items,
          shipping_date: dateString,
          order_details: response.items.order_details
            .map((order_detail: any) => {
              order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
              order_detail.number_of_products = order_detail.number_of_products
              order_detail.total_money = order_detail.total_money
              return order_detail;
            })
        };
        this.getCouponCode(this.orderResponse.coupon_id);
        // this.orderResponse.id = response.items.id;
        // this.orderResponse.user_id = response.items.user_id;
        // this.orderResponse.fullname = response.items.fullname;
        // this.orderResponse.phone_number = response.items.phone_number;
        // this.orderResponse.email = response.items.email;
        // this.orderResponse.address = response.items.address;
        // this.orderResponse.note = response.items.note;
        // if (response.items.order_date) {
        //   this.orderResponse.order_date = new Date(
        //     response.items.order_date[0],
        //     response.items.order_date[1] - 1,
        //     response.items.order_date[2]
        //   );
        // }
        // this.orderResponse.status = response.items.status;
        // this.orderResponse.total_money = response.items.total_money;
        // this.orderResponse.shipping_method = response.items.shipping_method;
        // this.orderResponse.shipping_address = response.items.shipping_address;
        // if (response.items.shipping_date) {
        //   this.orderResponse.shipping_date = new Date(
        //     response.items.shipping_date[0],
        //     response.items.shipping_date[1] - 1,
        //     response.items.shipping_date[2]
        //   );
        // }
        // debugger
        // this.dateString = this.orderService.convertToISODate(response.items.shipping_date, this.timezone);
        // this.orderResponse.shipping_date = this.dateString;
        // this.orderResponse.payment_method = response.items.payment_method;
        // this.orderResponse.trackingNumber = response.items.tracking_number;
        // this.orderResponse.order_details = response.items.order_details
        //   .map((order_detail: any) => {
        //     order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
        //     order_detail.number_of_products = order_detail.number_of_products
        //     order_detail.total_money = order_detail.total_money
        //     return order_detail;
        //   });
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        console.log(error.message);
      }
    });
  }

  updateOrder(orderId: number) {
    debugger
    this.orderUpdateResponse = {
      ...this.orderResponse
    };
    this.orderService.UpdateOrder(new OrderUpdateDTO(this.orderUpdateResponse), orderId).subscribe({
      next: (response: any) => {
        debugger
        alert(response.message);
        this.router.navigate(['/admin/orders'], { relativeTo: this.route });
      },
      error: (error: any) => {
        alert(error.message);
        console.log(error.message)
      }
    })
  }

  getCouponCode(couponId: number): void {
    this.couponService.getCouponId(couponId).subscribe({
      next: (response: any) => {
        this.couponCode = response.items.code;
      }
    });
  }

}
