import { ProductResponse } from "./product.response";
import { UserResponse } from "./user/user.response";

export interface CommentAdminResponse {
  id: number,
  user: UserResponse,
  product_id: number,
  content: string,
  createdAt: Date,
  updatedAt: Date,
}
