import { Product } from "../models/product";

export interface ProductImageResponse {
  id: number;
  image_url: string;
  product_name: string;
  product_id: number;
}
