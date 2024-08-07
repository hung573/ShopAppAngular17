import { HeaderComponent } from './../header/header.component';
import { TokenService } from './../../service/token.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { count } from 'rxjs';
import { Role } from '../../models/role';
import { LoginResponse } from '../../reponses/user/login.response';
import { UserResponse } from '../../reponses/user/user.response';
import { CartService } from '../../service/cart.service';
import { RoleService } from '../../service/role.service';

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild('loginrForm') loginrForm!: NgForm;

  phoneNumber: string = '';
  password: string = '';
  passwordFieldType: boolean = false;
  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = false;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService: CartService
  ) {

  }

  onPhoneNumberChange() {
    console.log(`phone Type: ${this.phoneNumber}`);
  }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    // debugger
    // this.roleService.getRoles().subscribe({
    //   next: (roles: Role[]) => { // Sử dụng kiểu Role[]
    //     debugger
    //     this.roles = roles;
    //     this.selectedRole = roles.length > 0 ? roles[1] : undefined;
    //   },
    //   error: (error: any) => {
    //     debugger
    //     alert(error);
    //     console.error('Error getting roles:', error);
    //   }
    // });
  }


  login() {
    debugger
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      // role_id: this.selectedRole?.id ?? 0

    };
    debugger
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.userService.getUserDetails(token).subscribe({
            next: (response: any) => {
              debugger;
              this.userResponse = {
                id: response.items.id,
                fullname: response.items.fullname,
                phone_number: response.items.phone_number,
                address: response.items.address,
                active: response.items.active,
                dateOfBirth: new Date(response.items.dateOfBirth),
                role: response.items.role,
                facebook_account_id: response.items.facebook_account_id,
                google_account_id: response.items.google_account_id
              };
              this.userService.saveUserToLocalStorage(this.userResponse);
              // this.router.navigate(['/home']);
              if (this.userResponse.role.id === 1) {
                this.router.navigateByUrl('/admin', { skipLocationChange: false }).then(() => {
                  window.location.reload();
                });
              }
              else {
                this.router.navigateByUrl('/home', { skipLocationChange: false }).then(() => {
                  window.location.reload();
                });
              }
            },
            complete: () => {
              debugger;
              this.cartService.refreshCart();
            },
            error: (error: any) => {
              debugger;
              alert(error.message);
            }
          });
        }
        else {
          alert('Check')
        }
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        alert(error.error.message);
      }
    })
  }
  togglePasswordVisibility() {
    this.passwordFieldType = !this.passwordFieldType;
  }
  checkRememberMe(): void {
    if (this.rememberMe) {
      this.rememberMe = false;
    } else {
      this.rememberMe = true;
    }
  }

}
