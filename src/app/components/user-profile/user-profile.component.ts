import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationError } from 'class-validator';
import { UserResponse } from '../../reponses/user/user.response';
import { UserUpdateDTO } from '../../dtos/user/user.update.dto';
import { TokenService } from '../../service/token.service';
import { UserService } from '../../service/user.service';

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserProfileComponent implements OnInit {
  userResponse?: UserResponse;
  userProfileForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  token: string;
  timeZone: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService) {
    debugger
    this.userProfileForm = this.fb.group({
      fullname: [''],
      password: ['', [Validators.minLength(6), this.noWhitespaceValidator()]],
      retype_password: ['', [Validators.minLength(6), this.noWhitespaceValidator()]],
      address: ['', [Validators.minLength(5)]],
      date_of_birth: [Date.now()],
      facebook_account_id: [0],
      google_account_id: [0]
    }, {
      validators: this.passwordMathValidator()
    });
    this.token = '';
    this.timeZone = 'Asia/Ho_Chi_Minh'
  }
  ngOnInit(): void {
    debugger;
    this.token = this.tokenService.getToken() ?? '';
    this.userService.getTokenToDB(this.token).subscribe({
      next: (reponse: any) => {
        if (reponse !== null) {
          return;
        }
      },
      complete: () => {

      },
      error: (erorr: any) => {
        alert("Tài khoản của bạn được đăng nhập từ nơi khác !!!");
        this.userService.removeUserToLocalStorage();
        this.tokenService.removeToken();
        this.router.navigate(['/login']);
      }
    });
    this.getUserDetails(this.token);
  }
  getUserDetails(token: string) {
    this.userService.getUserDetails(token).subscribe({
      next: (response: any) => {
        debugger;
        const dateOfBirthISO = this.userService.convertToISODate(response.items.dateOfBirth, this.timeZone);
        this.userResponse = {
          ...response.items,
          dateOfBirth: dateOfBirthISO
        };
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          password: '',
          retype_password: '',
          address: this.userResponse?.address ?? '',
          date_of_birth: this.userResponse?.dateOfBirth,
          facebook_account_id: this.userResponse?.facebook_account_id,
          google_account_id: this.userResponse?.google_account_id
        });
        this.userService.saveUserToLocalStorage(this.userResponse);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert(error)
      }
    });
  }
  passwordMathValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      debugger
      const password = formGroup.get('password')?.value;
      const retype_password = formGroup.get('retype_password')?.value;
      if (password !== retype_password) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  // kiểm tra dấu khoảng trắng
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').includes(' ');
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  save(): void {
    debugger;
    if (this.userProfileForm.valid) {
      debugger
      const updateUserDTO: UserUpdateDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value,
        google_account_id: this.userProfileForm.get('google_account_id')?.value,
        facebook_account_id: this.userProfileForm.get('facebook_account_id')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value
      };

      this.userService.updateUser(this.token, updateUserDTO).subscribe({
        next: (response: any) => {
          this.userService.removeUserToLocalStorage();
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          alert('Cập nhật thông tin thất bại');
          console.log(`Update false ${error.message}`)
        }
      });

    }
    else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        alert('Mật khẩu gõ lại chưa chính xác');
        return;
      }
      return alert('Bạn cần phải nhập đúng định dạng !!!')
    }
  }

}
