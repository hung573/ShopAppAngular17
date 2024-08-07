import { CategoryService } from './../../../service/category.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';
import { Category } from '../../../models/category';
import { Product } from '../../../models/product';
import { ProductResponse } from '../../../reponses/product.response';
import { ProductService } from '../../../service/product.service';
import { TokenService } from '../../../service/token.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: ['./product.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ProductAdminComponent implements OnInit {
  products: ProductResponse[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 1;
  itemsPerPage: number = 6;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";

  constructor(
    private productService: ProductService,
    private router: Router,
    private tokenService: TokenService,
    private categoryService: CategoryService
  ) {
  }
  ngOnInit(): void {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategory(1, 100);

  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger
        response.items.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          if (product.thumbnail == null) {
            product.url = 'https://cellphones.com.vn/sforum/wp-content/uploads/2021/09/404.2.png'
          }
        });
        this.products = response.items;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });
  }

  getCategory(page: number, limit: number): void {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (reponse: any) => {
        this.categories = reponse.items;
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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

  searchOrder() {
    this.currentPage = 1;
    this.itemsPerPage = 6;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  updateProduct(productId: number) {
    debugger
    this.router.navigate([`/admin/products/update`, productId]);
  }

  limitText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  // Hàm xử lý sự kiện khi thêm mới sản phẩm
  insertProduct() {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/products/insert']);
  }

  deleteProduct(productId: number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this product?');
    if (confirmation) {
      debugger
      this.productService.deleteProduct(productId).subscribe({
        next: (response: any) => {
          debugger
          alert('Xóa thành công')
          // location.reload();
          this.ngOnInit();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error)
          console.error('Error fetching products:', error);
        }
      });
    }
  }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 6;
    //Mediocre Iron Wallet
    debugger
    this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

}
