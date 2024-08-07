import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/environment';
import { ProductImage } from '../../../models/productImage';
import { ProductImageResponse } from '../../../reponses/product-image.response';
import { ProductImageService } from '../../../service/product-image.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-image-admin',
  templateUrl: './product-image.admin.component.html',
  styleUrls: ['./product-image.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class ProductImageAdminComponent implements OnInit {
  product_image: ProductImageResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";

  constructor(
    private productImgService: ProductImageService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.getAllProductIMG(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllProductIMG(keyword: string, page: number, limit: number): void {
    debugger
    this.productImgService.getProductIMG(keyword, page, limit).subscribe({
      next: (response: any) => {
        response.items.forEach((productIMG: ProductImage) => {
          debugger;
          if (productIMG.image_url.includes('http')) {
            productIMG.image_url = productIMG.image_url;
          } else {
            productIMG.image_url = `${environment.apiBaseUrl}/products/images/${productIMG.image_url}`;
          }
          if (productIMG.image_url == null) {
            productIMG.image_url = 'https://cellphones.com.vn/sforum/wp-content/uploads/2021/09/404.2.png'
          }
        });
        debugger
        this.product_image = response.items;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllProductIMG(this.keyword, this.currentPage, this.itemsPerPage);
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
    this.getAllProductIMG(this.keyword, this.currentPage, this.itemsPerPage);
  }

  onOrderClick(orderId: number) {
    debugger
    // this.router.navigate(['/products', productId]);
  }

  limitText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

}
