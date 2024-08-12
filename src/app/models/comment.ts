import { UserResponse } from "../reponses/user/user.response";
import { Product } from "./product";

export interface Comment {
  id: number;
  product: Product;
  user: UserResponse;
  content: string;
}
