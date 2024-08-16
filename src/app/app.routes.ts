import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { NgModule } from "@angular/core";
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order.detail.component';
import { AuthGuardFn } from './guards/auth.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuardFn } from './guards/admin.guard';
import { OrderAdminComponent } from './components/admin/order.admin/order.admin.component';
import { ProductAdminComponent } from './components/admin/product.admin/product.admin.component';
import { CategoryAdminComponent } from './components/admin/category.admin/category.admin.component';
import { CategoryDetailAdminComponent } from './components/admin/category-detail.admin/category-detail.admin.component';
import { OrderPurchaseComponent } from './components/order-purchase/order-purchase.component';
import { OrderDetailAdminComponent } from './components/admin/order-detail.admin/order-detail.admin.component';
import { ProductDetailAdminComponent } from './components/admin/product-detail.admin/product-detail.admin.component';
import { ProductImageAdminComponent } from './components/admin/product-image.admin/product-image.admin.component';
import { InsertProductAdminComponent } from './components/admin/product.admin/insert/insert.product.admin.component';
import { UpdateProductAdminComponent } from './components/admin/product.admin/update/update.product.admin.component';
import { RoleAdminComponent } from './components/admin/role.admin/role.admin.component';
import { InsertUserAdminComponent } from './components/admin/user.admin/insert/insert.user.admin.component';
import { UpdateUserAdminComponent } from './components/admin/user.admin/update/update.user.admin.component';
import { UserAdminComponent } from './components/admin/user.admin/user.admin.component';
import { CommentAdminComponent } from './components/admin/comment.admin/comment.admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
  { path: 'smember', component: UserProfileComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'orders-purchase/:id', component: OrderPurchaseComponent, canActivate: [AuthGuardFn] },


  //Admin
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuardFn], children: [
      { path: 'orders', component: OrderAdminComponent },
      { path: 'order/:id', component: OrderDetailAdminComponent },

      { path: 'products', component: ProductAdminComponent },
      { path: 'products/insert', component: InsertProductAdminComponent },
      { path: 'product-image', component: ProductImageAdminComponent },
      { path: 'product-image-detail', component: ProductDetailAdminComponent },
      { path: 'products/update/:id', component: UpdateProductAdminComponent },


      { path: 'categories', component: CategoryAdminComponent },
      { path: 'category/:id', component: CategoryDetailAdminComponent },
      { path: 'category', component: CategoryDetailAdminComponent },

      { path: 'users', component: UserAdminComponent },
      { path: 'user/insert', component: InsertUserAdminComponent },
      { path: 'user/update/:id', component: UpdateUserAdminComponent },

      { path: 'roles', component: RoleAdminComponent },

      { path: 'comments', component: CommentAdminComponent },

    ]
  },



];
