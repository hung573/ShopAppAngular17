import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../../reponses/user/user.response';
import { TokenService } from '../../service/token.service';
import { UserService } from '../../service/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminComponent implements OnInit {
  userResponse?: UserResponse | null;
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.userResponse = this.userService.getUserToLocalStorage();
  }
  logout() {
    this.userService.removeUserToLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserToLocalStorage();
    this.router.navigate(['/login'])
  }

}
