import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { UserResponse } from '../../reponses/user/user.response';
import { UserService } from '../../service/user.service';
import { CartService } from '../../service/cart.service';
import { TokenService } from '../../service/token.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ]
})
export class HeaderComponent implements OnInit {

  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  userId: number = 0;
  constructor(
    private userService: UserService,
    private popoverConfig: NgbPopoverConfig,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const userLocal = this.userService.getUserToLocalStorage();
    if (userLocal !== null) {
      this.userId = +userLocal.id;
    }
    this.userResponse = this.userService.getUserToLocalStorage();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    debugger

    if (index === 0) {
      this.router.navigate(['/smember']);
    }
    else if (index === 1) {
      this.router.navigate([`/orders-purchase/${this.userId}`]);
    }
    else if (index === 2) {
      this.userService.removeUserToLocalStorage();
      this.tokenService.removeToken();
      this.cartService.clearCart();
      this.userResponse = this.userService.getUserToLocalStorage();
      this.router.navigate(['/login']);
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item
  }



  setActiveNavItem(index: number) {
    debugger
    this.activeNavItem = index;
  }

}
