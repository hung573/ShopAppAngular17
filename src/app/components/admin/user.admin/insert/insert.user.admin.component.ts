import { Router } from '@angular/router';
import { UserService } from './../../../../service/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterDTO } from '../../../../dtos/user/register.dto';

@Component({
  selector: 'app-insert.user.admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './insert.user.admin.component.html',
  styleUrl: './insert.user.admin.component.scss'
})
export class InsertUserAdminComponent {

  insertUserDTO: RegisterDTO = {
    fullname: '',
    phone_number: '',
    address: '',
    password: '',
    retype_password: '',
    date_of_birth: new Date(),
    facebook_account_id: 0,
    google_account_id: 0
  }

  constructor(
    private userService: UserService,
    private router: Router
  ) { }


  insertUser() {
    this.userService.register(this.insertUserDTO).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.router.navigate(['/admin/users']);
      },
      complete: () => {

      },
      error: (error: any) => {
        alert('insert that bai');
        console.log(error.message);
      }
    })
  }

}
