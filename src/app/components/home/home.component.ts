import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/environment';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CartService } from '../../service/cart.service';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';
import { TokenService } from '../../service/token.service';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    FooterComponent,
    FormsModule
  ]
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 1;
  itemsPerPage: number = 16;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private cartService: CartService,
    private tokenService: TokenService
  ) {
  }


  ngOnInit(): void {
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);

  }

  limitText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger
    this.productService.getProductsIsActive(keyword, selectedCategoryId, page, limit).subscribe({
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

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.categories = response.items;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
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

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 16;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  onProductClick(productId: number) {
    debugger
    this.router.navigate(['/products', productId]);
  }

  addToCart(productId: number): void {
    debugger
    if (productId) {
      this.cartService.addToCart(productId, this.quantity);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  buyNow(): void {
    this.router.navigate(['/orders']);
  }

}
