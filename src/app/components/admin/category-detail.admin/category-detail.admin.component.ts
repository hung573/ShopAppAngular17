import { map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from '../../../dtos/category.dto';
import { CategoryResponse } from '../../../reponses/category.response';
import { CategoryService } from '../../../service/category.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail-admin',
  templateUrl: './category-detail.admin.component.html',
  styleUrls: ['./category-detail.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CategoryDetailAdminComponent implements OnInit {
  categoryForm: FormGroup;
  categoryResponse?: CategoryResponse;
  categoryId: number = 0;
  formcheck: boolean = true;
  categoryData: CategoryDTO = {
    name: ''
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.categoryId = +idParam;
      if (!isNaN(this.categoryId)) {
        this.categoryService.getCategoryId(this.categoryId).subscribe({
          next: (response: any) => {
            debugger
            this.categoryResponse = {
              ...response.items
            }
            this.categoryForm.patchValue({
              name: this.categoryResponse?.name ?? '',
            });
          },
          complete: () => {
            debugger;
          },
          error: (error: any) => {
            debugger;
            console.error('Error fetching detail:', error);
          }
        });
      } else {
        console.error('Invalid productId:', idParam);
      }
    }
    else {
      this.formcheck = false;
    }

  }

  handleSubmit(): void {
    if (this.formcheck) {
      this.UpdateCategory();
    } else {
      this.AddCategory();
    }
  }

  UpdateCategory() {
    if (this.categoryForm.valid) {
      const idParam = this.activatedRoute.snapshot.paramMap.get('id');
      if (idParam !== null) {
        this.categoryId = +idParam;
      }
      this.categoryData = {
        ...this.categoryForm.value
      }
      this.categoryService.updateCategory(this.categoryData, this.categoryId).subscribe({
        next: (response: any) => {
          alert('Cập nhật thành công');
          this.router.navigate(['/admin/categories']);
        },
        error: (error: any) => {
          debugger;
          console.log(error.message)
        }
      })
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert(`Lỗi khi Update Category !!!`);
      console.log('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }
  AddCategory() {
    if (this.categoryForm.valid) {
      this.categoryData = {
        ...this.categoryForm.value
      }
      this.categoryService.addCategory(this.categoryData).subscribe({
        next: (response: any) => {
          alert('Thêm mới thành công');
          this.router.navigate(['/admin/categories']);
        },
        error: (error: any) => {
          debugger;
          console.log(error.message)
        }
      })
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert(`Lỗi khi Add Category !!!`);
      console.log('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }
}
