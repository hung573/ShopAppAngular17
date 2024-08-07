import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserAdminUpdateDTO } from '../../../../dtos/user/user.admin.update';
import { Role } from '../../../../models/role';
import { UserService } from '../../../../service/user.service';
import { RoleService } from '../../../../service/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { TokenService } from '../../../../service/token.service';
import { UserUpdateDTO } from '../../../../dtos/user/user.update.dto';

@Component({
  selector: 'app-update.user.admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './update.user.admin.component.html',
  styleUrl: './update.user.admin.component.scss'
})
export class UpdateUserAdminComponent implements OnInit {

  userId: number = 0;
  updateUserDTO: UserAdminUpdateDTO;
  roles: Role[] = [];
  timezone: string = 'Asia/Ho_Chi_Minh';
  token: string = '';
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.updateUserDTO = {} as UserAdminUpdateDTO;
  }

  ngOnInit(): void {
    debugger;
    this.route.paramMap.subscribe(parms => {
      debugger;
      this.userId = Number(parms.get('id'))
      this.getUserDetail();
    });
    this.getRoles();
  }

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: (reponse: any) => {
        this.roles = reponse;
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  getUserDetail() {
    debugger
    this.userService.getUserDetailAdmin(this.userId).subscribe({
      next: (response: any) => {
        const dateString = this.userService.convertToISODate(response.items.dateOfBirth, this.timezone);
        this.updateUserDTO = {
          ...response.items,
          is_active: response.items.active,
          role_id: response.items.role.id,
          date_of_birth: dateString
        };
      },
      complete: () => {

      },
      error: (error: any) => {
        console.log(error.message);
      }
    });
  }

  updateUser() {
    debugger
    this.userService.updateUserAdmin(this.userId, new UserAdminUpdateDTO(this.updateUserDTO)).subscribe({
      next: (response: any) => {
        debugger
        alert(response.message);
        this.router.navigate(['/admin/users'], { relativeTo: this.route });
      },
      error: (error: any) => {
        alert(error.message);
        console.log(error.message)
      }
    })
  }

}
