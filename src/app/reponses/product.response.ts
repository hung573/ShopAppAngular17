import { ProductImage } from "../models/productImage";

// import { ProductImage } from "./product.image";
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  nameCategory: string;
  url: string;
  product_images: ProductImage[];
}
