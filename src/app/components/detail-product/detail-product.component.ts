import { UserService } from './../../service/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../enviroments/environment';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/productImage';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment';
import { CommentResponse } from '../../reponses/comment.response';
import { CommentDTO } from '../../dtos/comment.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    FormsModule
  ]
})
export class DetailProductComponent implements OnInit {

  product?: Product;
  comments: CommentResponse[] = [];
  commentData: CommentDTO = {
    product_id: 0,
    user_id: 0,
    content: '',
  }
  productId: number = 0;
  userId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private userService: UserService

  ) { }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    const userLocal = this.userService.getUserToLocalStorage();
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (userLocal !== null) {
      this.userId = +userLocal.id;
    }
    this.commentData = {
      product_id: this.productId,
      user_id: this.userId,
      content: '',
    }
    this.Test();
    this.ShowComment();
  }

  Test(): void {
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger
          if (response.items.product_images && response.items.product_images.length > 0) {
            response.items.product_images.forEach((product_image: ProductImage) => {
              if (product_image.image_url.includes('http')) {
                product_image.image_url = product_image.image_url;
              } else {
                product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              }
            });
          }
          debugger
          this.product = response.items
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
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
      console.error('Invalid productId:');
    }
  }

  ShowComment(): void {

    if (!isNaN(this.productId)) {
      this.commentService.getCommentByProductId(this.productId, 1, 10).subscribe({
        next: (response: any) => {
          debugger
          this.comments = response.items;
          // Bắt đầu với ảnh đầu tiên
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
      console.error('Invalid productId:');
    }
  }

  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = this.product.product_images.length - 1;
      }
      else if (index >= this.product.product_images.length) {
        index = 0;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    debugger
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    this.router.navigate(['/orders']);
  }

  addComment() {
    if (!isNaN(this.productId) && !isNaN(this.userId)) {
      this.commentService.addComment(this.commentData).subscribe({
        next: (response: any) => {
          this.ngOnInit();
        },
        complete: () => {
        },
        error: (error: any) => {
          alert(error.message)
        }
      });
    }
    else {
      console.error('Invalid productId:');
      console.error('Invalid userId:');
    }
  }

}
