import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InsertProductDTO } from '../../../../dtos/product/insert.product.dto';
import { Category } from '../../../../models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../service/category.service';
import { ProductService } from '../../../../service/product.service';
import { error } from 'node:console';

@Component({
  selector: 'app-insert.product.admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './insert.product.admin.component.html',
  styleUrl: './insert.product.admin.component.scss'
})
export class InsertProductAdminComponent implements OnInit {

  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0.0,
    description: '',
    category_id: 1,
    images: []
  };
  updateProductDTO: UpdateProductDTO = {
    name: '',
    price: 0.0,
    description: '',
    thumbnail: '',
    category_id: 1,
    active: true
  }
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        debugger
        this.categories = response.items;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  // kiem tra so luong hinh anh duoc them vaof image[]
  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('1 sản phẩm tối đa được 5 hình ảnh!');
      return;
    }
    this.insertProductDTO.images = files;
  }

  insertProduct() {
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (response: any) => {
        debugger;
        if (this.insertProductDTO.images.length > 0) {
          debugger
          const productId = response.items.id;
          this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
            next: (imageResponse) => {
              debugger
              // Handle the uploaded images response if needed
              console.log('Images uploaded successfully:', imageResponse);
              // Navigate back to the previous page
              this.updateProductDTO = {
                name: response.items.name,
                price: response.items.price,
                description: response.items.description,
                category_id: response.items.category.id,
                thumbnail: imageResponse[0].image_url,
                active: response.items.active
              };
              debugger
              this.productService.updateProduct(productId, this.updateProductDTO).subscribe({
                next: (updateProduct: any) => {
                  debugger
                  this.router.navigate(['../'], { relativeTo: this.route });
                  debugger;
                },
                error: (error: any) => {
                  console.log(error);
                }
              });

            },
            error: (error) => {
              // Handle the error while uploading images
              alert(error.error)
              console.error('Error uploading images:', error);
            }
          });
        }
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        alert('Thêm sản phẩm thất bại');
        console.log(error.message);
      }
    });
  }

}
