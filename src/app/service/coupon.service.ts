import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environment";
import { CouponConditionResponse } from "../reponses/coupon/couponCondition.response";
import { Observable } from "rxjs";
import { CouponResponse } from "../reponses/coupon/coupon.response";
import { Coupon } from "../models/coupon";

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiGetCoupons = `${environment.apiBaseUrl}/coupons`;
  constructor(private http: HttpClient) { }

  getAllCouponCondition(): Observable<CouponConditionResponse[]> {
    return this.http.get<CouponConditionResponse[]>(`${this.apiGetCoupons}/listCouponConditions`);
  }

  getAllCoupon(): Observable<CouponResponse[]> {
    return this.http.get<CouponResponse[]>(`${this.apiGetCoupons}/listCoupons`);
  }

  ApllyCoupon(couponCode: string, totalAmount: number) {
    debugger;
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount)
    return this.http.get(`${this.apiGetCoupons}`, { params });
  }

  getCouponId(couponId: number): Observable<Coupon> {
    debugger;
    const params = new HttpParams()
      .set('couponId', couponId)
    return this.http.get<Coupon>(`${this.apiGetCoupons}/getCouponId`, { params });
  }
}
