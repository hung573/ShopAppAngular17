import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ProductImage } from "../models/productImage";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private apiGetProductIMG = `${environment.apiBaseUrl}/product-images`;

  constructor(private http: HttpClient) { }

  getProductIMG(keyword: string,
    page: number, limit: number
  ): Observable<ProductImage[]> {
    debugger;
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ProductImage[]>(this.apiGetProductIMG, { params });
  }

}
