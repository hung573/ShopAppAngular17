import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CommentResponse } from "../reponses/comment.response";
import { Comment } from "../models/comment";
import { Observable } from "rxjs";
import { CommentDTO } from "../dtos/comment.dto";
import { CommentAdminResponse } from "../reponses/comment.admin.response";

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  private apiGetComments = `${environment.apiBaseUrl}/comments`;
  constructor(private http: HttpClient) { }

  getCommentByProductId(id: number, page: number, limit: number): Observable<CommentResponse[]> {
    debugger
    const params = new HttpParams()
      .set('id', id.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<CommentResponse[]>(`${this.apiGetComments}/by-product`, { params });
  }

  addComment(commentDTO: CommentDTO): Observable<any> {
    return this.http.post(`${this.apiGetComments}/add`, commentDTO);
  }

  getCommentAdmin(keyword: string, productId: number, page: number, limit: number): Observable<CommentAdminResponse[]> {
    debugger
    const params = new HttpParams()
      .set('keyword', keyword.toString())
      .set('product_id', productId.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<CommentAdminResponse[]>(`${this.apiGetComments}/admin`, { params });
  }
}
