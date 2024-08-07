import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../service/category.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: ['./category.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]

})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }
  ngOnInit(): void {
    this.getCategories(this.currentPage, this.itemsPerPage);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.categories = response.items;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
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
    this.getCategories(this.currentPage, this.itemsPerPage);
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
    this.itemsPerPage = 12;
    debugger
    this.getCategories(this.currentPage, this.itemsPerPage);
  }

  onUpdateCategoryClick(categoryId: number) {
    debugger
    this.router.navigate(['admin/category', categoryId]);
  }

  onAddCategoryClick() {
    debugger
    this.router.navigate(['admin/category']);
  }

  onDeleteCategoryClick(categoryId: number) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        alert('Xoá thành công');
        this.ngOnInit();
      },
      error: (error: any) => {
        alert('Xoá thất bại');
        console.log(error.message);
      }
    })
  }

  limitText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

}
