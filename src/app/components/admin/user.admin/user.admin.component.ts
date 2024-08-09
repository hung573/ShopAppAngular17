import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserResponse } from '../../../reponses/user/user.response';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user.admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user.admin.component.html',
  styleUrl: './user.admin.component.scss'
})
export class UserAdminComponent implements OnInit {

  users: UserResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  activee: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.getAllUser(this.keyword, this.currentPage, this.itemsPerPage);
  }

  getAllUser(keyword: string, page: number, limit: number) {
    debugger
    this.userService.getAllUsers(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.users = response.items;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    })
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

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllUser(this.keyword, this.currentPage, this.itemsPerPage);
  }

  limitText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  searchUsers() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    //Mediocre Iron Wallet
    debugger
    this.getAllUser(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  onAddUser() {
    this.router.navigate(['admin/user/insert'])
  }
  updateUser(userId: number) {
    this.router.navigate([`admin/user/update`, userId]);
  }
  deleteUser(userId: number, active: boolean) {
    let message: String
    if (active) {
      this.activee = 0;
      message = 'Are you sure you want to delete this account?';
    }
    else {
      this.activee = 1;
      message = 'Are you sure you want to enable this account?';
    }
    const confirmation = window
      .confirm(`${message}`);
    if (confirmation) {
      this.userService.deleteUserAdmin(userId, this.activee).subscribe({
        next: (reponse: any) => {
          debugger
          alert(`${reponse.message}`)
          // location.reload();
          this.ngOnInit();
        },
        error: (error: any) => {
          debugger;
          alert(error.message)
          console.error('Error fetching products:', error.message);
        }
      })
    }

  }

}
