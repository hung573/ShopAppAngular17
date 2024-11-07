import { CouponResponse } from './../../reponses/coupon/coupon.response';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../dtos/order/order.dto';
import { environment } from '../../enviroments/environment';
import { Product } from '../../models/product';
import { UserResponse } from '../../reponses/user/user.response';
import { CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';
import { ProductService } from '../../service/product.service';
import { TokenService } from '../../service/token.service';
import { UserService } from '../../service/user.service';

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CouponConditionResponse } from '../../reponses/coupon/couponCondition.response';
import { CouponService } from '../../service/coupon.service';
import { error } from 'console';
import { PaymentService } from '../../service/payment.service';
import { PaymentResponse } from '../../reponses/payment.response';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product, quantity: number }[] = [];
  userResponse?: UserResponse | null;
  totalAmount: number = 0; // Tổng tiền
  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    shipping_date: new Date(),
    status: 'pending',
    payment_method: '', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    shipping_address: '',// Dia chi giao den
    coupon_id: 0, // Sẽ được điền từ form khi áp dụng mã giảm giá
    payment_id: 0,
    cart_items: []
  };
  couponConditionResponse: CouponConditionResponse[] = [];
  couponResponse: CouponResponse[] = [];
  paymentResponse: PaymentResponse[] = [];
  couponCode: string = ''; // Mã giảm giá
  paymentName: String = '';
  token: string;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private couponService: CouponService,
    private paymentService: PaymentService

  ) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      note: [''],
      shipping_method: ['express'],
      shipping_address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      payment_method: [''],
      coupon_id: 0,
      payment_id: 0
    });
    this.token = '';
    // Convert the coupon_code to a number whenever its value changes
    this.orderForm.get('coupon_id')?.valueChanges.subscribe(value => {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        this.orderForm.get('coupon_id')?.setValue(numericValue, { emitEvent: false });
      }
    });
    this.orderForm.get('payment_id')?.valueChanges.subscribe(value => {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        this.orderForm.get('payment_id')?.setValue(numericValue, { emitEvent: false });
        this.paymentService.getPaymentId(numericValue).subscribe({
          next: (response: any) => {
            this.orderForm.get('payment_method')?.setValue(response.items.payment_name, { emitEvent: false });
          },
        });
      }
    });

  }

  ngOnInit(): void {
    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger
    this.orderData.user_id = this.tokenService.getUserId();

    debugger
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng

    // Goi service để lấy thông tin khách hàng
    debugger
    this.token = this.tokenService.getToken() ?? '';

    this.userService.getTokenToDB(this.token).subscribe({
      next: (reponse: any) => {
        if (reponse !== null) {
          return;
        }
      },
      complete: () => {

      },
      error: (erorr: any) => {
        alert('Tài khoản của bạn được đăng nhập từ nơi khác !!!');
        this.userService.removeUserToLocalStorage();
        this.tokenService.removeToken();
        this.router.navigate(['/login']);
      }
    });

    this.userService.getUserDetails(this.token).subscribe({
      next: (response: any) => {
        debugger;
        this.userResponse = {
          ...response.items,
        };
        this.orderForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          phone_number: this.userResponse?.phone_number ?? '',
          shipping_address: this.userResponse?.address ?? ''
        });
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error)
      }
    });
    debugger
    if (productIds.length === 0) {
      this.cartItems = [];
      return;
    }
    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });

    this.couponService.getAllCoupon().subscribe({
      next: (response: any) => {
        this.couponResponse = response.items;
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
    this.paymentService.getPayments().subscribe({
      next: (response: any) => {
        this.paymentResponse = response.items;
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });

  }
  placeOrder() {
    if (this.orderForm.valid) {
      // Gán giá trị từ form vào đối tượng orderData
      /*
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      */
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
        // coupon_id: this.coupon_idd,
        user_id: this.tokenService.getUserId(),
        address: this.userResponse?.address
      };
      debugger;
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: any) => {
          debugger;
          alert('Đặt hàng thành công');
          this.cartService.clearCart();
          this.router.navigate(['/orders/', response.items.id]);
        },
        complete: () => {
          debugger;
          this.calculateTotal();
        },
        error: (error: any) => {
          debugger;
          alert(`Lỗi khi đặt hàng: ${error}`);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert(`Lỗi khi đặt hàng !!!`);
      console.log('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    this.orderData.total_money = this.totalAmount;
  }

  onProductClick(productId: number) {
    debugger
    this.router.navigate(['/products', productId]);
  }

  deItemProduct(productId: number) {
    this.cartService.deleteItemCart(productId);
    this.ngOnInit();
  }

  addQuantity(productID: number): void {
    this.cartService.adddQuantityCart(productID);
    this.ngOnInit();
  }
  removeQuantity(productID: number): void {
    this.cartService.removeQuantityCart(productID);
    this.ngOnInit();
    if (this.cartService.checkQuantity(productID)) {
      alert('Số lượng sản phẩm đã giảm đến mức tối thiểu')
    }
  }

  apllyCoupon() {
    this.orderData = {
      ...this.orderForm.value
    }
    this.couponService.getCouponId(this.orderData.coupon_id).subscribe({
      next: (response: any) => {
        this.couponCode = response.items.code;

        this.couponService.ApllyCoupon(this.couponCode, this.totalAmount).subscribe({
          next: (responseApllyCoupon: any) => {
            debugger;
            this.totalAmount = responseApllyCoupon.items;
            this.orderData.total_money = responseApllyCoupon.items;
            debugger;
          },
          error: (error: any) => {
            alert("Lỗi không tính TotalAmount lại được");
            console.log(error.message);
          }
        });
      },
      error: (error: any) => {
        alert("Lỗi khi chọn Coupon. Mời bạn thử lại.");
        console.log(error.message);
      }
    });
  }

}

