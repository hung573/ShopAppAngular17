import { Inject, Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { BehaviorSubject } from "rxjs";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private cart: Map<number, number> = new Map(); // Dùng Map để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng
  localStorage?: Storage;

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.localStorage = document.defaultView?.localStorage;
    this.refreshCart();
  }

  public refreshCart() {
    const storedCart = this.localStorage?.getItem(this.getCartKey());
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    } else {
      this.cart = new Map<number, number>();
    }
  }

  //Lấy key Cart
  getCartKey(): string {
    const userResponseJSON = this.localStorage?.getItem('user');
    const userResponse = JSON.parse(userResponseJSON!);
    if (userResponse === null) {
      return 'cart';
    }
    debugger;
    return `cart: ${userResponse.id}`;
  }

  // Lưu trữ giỏ hàng vào localStorage
  public saveCartToLocalStorage(): void {
    debugger
    this.localStorage?.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
  }

  addToCart(productId: number, quantity: number = 1) {
    debugger
    if (this.cart.has(productId)) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với số lượng là `quantity`
      this.cart.set(productId, quantity);
    }
    // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
    this.saveCartToLocalStorage();
  }

  adddQuantityCart(productId: number) {
    debugger
    if (this.cart.has(productId)) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
      this.cart.set(productId, this.cart.get(productId)! + 1);
      // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
      this.saveCartToLocalStorage();
    }
  }

  removeQuantityCart(productId: number) {
    debugger
    if (this.cart.has(productId)) {
      // Nếu số lượng sản phẩm trong giỏ hàng lớn hơn 1, giảm số lượng đi 1
      if (this.cart.get(productId)! > 0) {
        this.cart.set(productId, this.cart.get(productId)! - 1);
      }

      // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage và cập nhật Subject
      this.saveCartToLocalStorage();
    }
  }

  checkQuantity(productId: number): boolean {
    if (this.cart.has(productId)) {
      // Nếu số lượng sản phẩm trong giỏ hàng lớn hơn 1, giảm số lượng đi 1
      if (this.cart.get(productId)! <= 0) {
        this.cart.set(productId, this.cart.get(productId)! + 1);
        return true;
      }
    }
    return false;
  }

  getCart(): Map<number, number> {
    debugger
    return this.cart;
  }

  // Hàm xóa dữ liệu giỏ hàng và cập nhật Local Storage
  clearCart(): void {
    this.cart.clear(); // Xóa toàn bộ dữ liệu trong giỏ hàng
    // this.saveCartToLocalStorage(); // Lưu giỏ hàng mới vào Local Storage (trống)
    // localStorage.clear();
  }

  deleteItemCart(productId: number): void {
    this.cart.delete(productId);
    this.saveCartToLocalStorage();
  }


}
