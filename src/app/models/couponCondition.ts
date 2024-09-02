import { Coupon } from "./coupon";

export interface CouponCondition {
  id: number;
  coupon: Coupon;
  attribute: String;
  operator: String;
  value: String;
  discount_amount: number;
}
