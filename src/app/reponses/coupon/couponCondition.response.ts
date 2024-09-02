export interface CouponConditionResponse {
  id: number;
  couponCode: String;
  attribute: String;
  operator: String;
  value: String;
  discount_amount: number;
}
