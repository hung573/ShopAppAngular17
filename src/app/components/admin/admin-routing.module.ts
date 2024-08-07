import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { CategoryAdminComponent } from "./category.admin/category.admin.component";
import { OrderAdminComponent } from "./order.admin/order.admin.component";
import { ProductAdminComponent } from "./product.admin/product.admin.component";
import { CategoryDetailAdminComponent } from "./category-detail.admin/category-detail.admin.component";
import { ProductDetailAdminComponent } from "./product-detail.admin/product-detail.admin.component";
import { OrderDetailAdminComponent } from "./order-detail.admin/order-detail.admin.component";
import { ProductImageAdminComponent } from "./product-image.admin/product-image.admin.component";
import { InsertProductAdminComponent } from "./product.admin/insert/insert.product.admin.component";
import { UpdateProductAdminComponent } from "./product.admin/update/update.product.admin.component";
import { UserAdminComponent } from "./user.admin/user.admin.component";
import { InsertUserAdminComponent } from "./user.admin/insert/insert.user.admin.component";
import { UpdateUserAdminComponent } from "./user.admin/update/update.user.admin.component";

export const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminComponent, children: [

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

    ]
  },
];

// @NgModule({
//   imports: [
//     RouterModule.forChild(routes)
//   ],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }
