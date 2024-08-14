import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { OrderResponse } from '../../reponses/order/order.response';
import { environment } from '../../enviroments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-purchase',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './order-purchase.component.html',
  styleUrl: './order-purchase.component.scss'
})
export class OrderPurchaseComponent implements OnInit {

  userId: number = 0;
  // orderResponse: OrderResponse = {
  //   id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
  //   user_id: 0,
  //   fullname: '',
  //   phone_number: '',
  //   email: '',
  //   address: '',
  //   note: '',
  //   order_date: new Date(),
  //   status: '',
  //   total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
  //   shipping_method: '',
  //   shipping_address: '',
  //   shipping_date: new Date(),
  //   payment_method: '',
  //   trackingNumber: '',
  //   order_details: [] // Một mảng rỗng
  // };
  orderResponse: OrderResponse[] = [];
  thumnail: String = `${environment.apiBaseUrl}/products/images/`
  constructor(
    private orderService: OrderService,
    private userService: UserService

  ) { }

  ngOnInit(): void {
    const userLocal = this.userService.getUserToLocalStorage();
    if (userLocal !== null) {
      this.userId = +userLocal.id;
    }
    this.getAllOrderByUser();
  }

  getAllOrderByUser() {
    debugger

    this.orderService.getAllOrdersByUser(this.userId).subscribe({
      next: (response: any) => {
        debugger
        this.orderResponse = response;
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    })
  }


}
