import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Product } from '../models/product';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiGetProducts = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(keyword: string, categoryId: number,
    page: number, limit: number
  ): Observable<Product[]> {
    debugger;
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }

  getProductsIsActive(keyword: string, categoryId: number,
    page: number, limit: number
  ): Observable<Product[]> {
    debugger;
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.apiGetProducts}/product-home`, { params });
  }

  getDetailProduct(productId: number) {
    return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
  }
  getProductsByIds(productIds: number[]): Observable<Product[]> {
    // Chuyển danh sách ID thành một chuỗi và truyền vào params
    debugger
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params });
  }

  insertProduct(insertProductDTO: InsertProductDTO): Observable<any> {
    // Add a new product
    return this.http.post(`${this.apiGetProducts}/add`, insertProductDTO);
  }
  uploadImages(productId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post(`${this.apiGetProducts}/uploads/${productId}`, formData);
  }
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
    return this.http.put<Product>(`${this.apiGetProducts}/update/${productId}`, updatedProduct);
  }

  deleteProduct(productId: number): Observable<string> {
    debugger
    return this.http.delete<string>(`${this.apiGetProducts}/delete/${productId}`);
  }

}
