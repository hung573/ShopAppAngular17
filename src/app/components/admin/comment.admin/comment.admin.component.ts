import { ProductService } from './../../../service/product.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product';
import { CommentService } from '../../../service/comment.service';
import { CommentResponse } from '../../../reponses/comment.response';
import { CommentAdminResponse } from '../../../reponses/comment.admin.response';

@Component({
  selector: 'app-comment.admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './comment.admin.component.html',
  styleUrl: './comment.admin.component.scss'
})
export class CommentAdminComponent implements OnInit {
  keyword: string = '';
  products: Product[] = [];
  selectedProductId: number = 0; // Giá trị product được chọn
  comments: CommentAdminResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(
    private productService: ProductService,
    private commentService: CommentService
  ) { }
  ngOnInit(): void {
    this.getComment(this.keyword, this.selectedProductId, this.currentPage, this.itemsPerPage);
    this.getProduct();
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getComment(this.keyword, this.selectedProductId, this.currentPage, this.itemsPerPage);
  }

  getProduct() {
    this.productService.getProducts('', 0, 1, 1000).subscribe({
      next: (response: any) => {
        this.products = response.items;
      },
      complete: () => {

      },
      error: (error: any) => {
        console.log(error.message);
      }
    })
  }

  getComment(keyword: string, selectedProductId: number, page: number, limit: number) {
    this.commentService.getCommentAdmin(keyword, selectedProductId, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        this.comments = response.items;
        debugger;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {

      },
      error: () => {

      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {

    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
}
