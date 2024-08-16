import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../models/role';
import { RoleService } from '../../../service/role.service';

@Component({
  selector: 'app-role-admin',
  templateUrl: './role.admin.component.html',
  styleUrls: ['./role.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RoleAdminComponent implements OnInit {

  roles: Role[] = [];
  activee: number = 0;

  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.getRole();
  }

  getRole() {
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response;
      },
      complete: () => {

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  insertRole() {

  }

  updateRole(roleId: number) {

  }
  deleteRole(roleId: number, active: boolean) {
    let message: String
    if (active) {
      this.activee = 0;
      message = 'Bạn chắc muốn Role này tạm ngưng hoạt động chứ?';
    }
    else {
      this.activee = 1;
      message = 'Bạn chắc muốn đưa Role này quay trở lại chứ?';
    }
    const confirmation = window
      .confirm(`${message}`);
    if (confirmation) {
      debugger
      this.roleService.removeRole(roleId, this.activee).subscribe({
        next: (response: any) => {
          debugger
          alert(response.message)
          // location.reload();
          this.ngOnInit();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error)
          console.error('Error fetching products:', error);
        }
      });
    }
  }

}
