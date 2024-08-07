import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../service/category.service';
import { ProductImageService } from '../../../../service/product-image.service';
import { error } from 'console';
import { ProductImage } from '../../../../models/productImage';
import { environment } from '../../../../enviroments/environment';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import { ProductResponse } from '../../../../reponses/product.response';

@Component({
  selector: 'app-update.product.admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './update.product.admin.component.html',
  styleUrl: './update.product.admin.component.scss'
})
export class UpdateProductAdminComponent implements OnInit {

  productId: number;
  product: Product;
  updatedProduct: Product;
  categories: Category[] = []; // Dữ liệu động từ categoryService
  currentImageIndex: number = 0;
  images: File[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productImageService: ProductImageService,
  ) {
    this.productId = 0;
    this.product = {} as Product;
    this.updatedProduct = {} as Product;

  }

  ngOnInit(): void {
    debugger
    this.route.paramMap.subscribe(parms => {
      debugger
      this.productId = Number(parms.get('id'));
      this.getProductDetail();
    });
    this.getCategory(1, 100);
  }

  getProductDetail(): void {
    debugger
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (reponse: any) => {
        debugger
        this.product = reponse.items;
        this.updatedProduct = { ...reponse.items };
        // this.updatedProduct.product_images.forEach(
        //   (product_image: ProductImage) => {
        //     debugger;
        //     product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
        //   }
        // );
        this.updatedProduct.product_images.forEach(
          (product_image: ProductImage) => {
            debugger;
            if (product_image.image_url.includes('http')) {
              product_image.image_url = product_image.image_url;
            } else {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            }
          }
        );

      },
      complete: () => {

      },
      error: (error: any) => {
        console.log(error.message);
      }
    })
  }

  getCategory(page: number, limit: number): void {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (reponse: any) => {
        this.categories = reponse.items;
      },
      complete: () => {

      },
      error: (error: any) => {

      }
    });
  }

  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  deleteImage(productImage: ProductImage) {
    if (confirm('Are you sure you want to remove this image?')) {
      // Call the removeImage() method to remove the image
      this.productImageService.deleteProductImage(productImage.id).subscribe({
        next: (productImage: ProductImage) => {
          location.reload();
        },
        error: (error) => {
          // Handle the error while uploading images
          alert(error.error)
          console.error('Error deleting images:', error);
        }
      });
    }
  }

  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 5) {
      alert('Please select a maximum of 5 images.');
      return;
    }
    // Store the selected files in the newProduct object
    this.images = files;
    this.productService.uploadImages(this.productId, this.images).subscribe({
      next: (imageResponse) => {
        debugger
        // Handle the uploaded images response if needed
        console.log('Images uploaded successfully:', imageResponse);
        this.images = [];
        // Reload product details to reflect the new images
        this.getProductDetail();
      },
      error: (error) => {
        // Handle the error while uploading images
        alert(error.error)
        console.error('Error uploading images:', error);
      }
    })
  }

  updateProduct() {
    // Implement your update logic here
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id,
      thumbnail: this.updatedProduct.thumbnail,
      active: this.updatedProduct.active

    };
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: (response: any) => {
        debugger
      },
      complete: () => {
        debugger;
        this.router.navigate(['/admin/products']);
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      }
    });
  }

  // Phương thức để thay đổi trạng thái active của sản phẩm
  toggleActive(product: any): void {
    product.active = !product.active;
  }

}
