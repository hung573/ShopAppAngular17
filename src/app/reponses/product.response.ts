import { ProductImage } from "../models/productImage";

// import { ProductImage } from "./product.image";
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  category_id: number;
  url: string;
  active: boolean;
  product_images: ProductImage[];
}
