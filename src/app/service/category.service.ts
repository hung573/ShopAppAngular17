import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../enviroments/environment";
import { Category } from "../models/category";
import { CategoryDTO } from "../dtos/category.dto";

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private apiGetCategories = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) { }
  getCategories(page: number, limit: number): Observable<Category[]> {
    debugger
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Category[]>(this.apiGetCategories, { params });
  }
  getCategoryId(categoryId: number) {
    return this.http.get(`${this.apiGetCategories}/${categoryId}`);
  }
  updateCategory(categoryData: CategoryDTO, id: number): Observable<any> {
    return this.http.put(`${this.apiGetCategories}/update/${id}`, categoryData);
  }
  addCategory(categoryData: CategoryDTO): Observable<any> {
    return this.http.post(`${this.apiGetCategories}/add`, categoryData);
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiGetCategories}/${id}`);
  }
}
