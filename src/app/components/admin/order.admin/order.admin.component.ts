import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResponse } from '../../../reponses/order/order.response';
import { OrderService } from '../../../service/order.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class OrderAdminComponent implements OnInit {
  orders: OrderResponse[] = [];
  currentPage = 1;
  itemsPerPage = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  constructor(
    private router: Router,
    private orderService: OrderService,
  ) {
  }
  ngOnInit(): void {
    debugger
    this.getOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }


  getOrders(keyword: string, page: number, limit: number) {
    debugger
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.orders = response.items;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching order:', error);
      }
    });
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getOrders(this.keyword, this.currentPage, this.itemsPerPage);
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
    this.getOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  onDetailOrderClick(orderId: number) {
    debugger
    this.router.navigate(['/admin/order', orderId]);
  }

  onDeleteOrderClick(orderId: number) {
    debugger
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      debugger
      this.orderService.DeleteOrder(orderId).subscribe({
        next: (response: any) => {
          debugger
          this.ngOnInit();
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
  }

  limitText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
}
