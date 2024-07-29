import { Inject, Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from "./user.service";
import { Observable, catchError, map, of } from "rxjs";
import { DOCUMENT } from "@angular/common";


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';
  private jwtHelper = new JwtHelperService();
  localStorage?: Storage;
  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  // getter va setter
  getToken(): string {
    debugger
    return this.localStorage?.getItem(this.TOKEN_KEY) ?? '';
  }

  setToken(token: string): void {
    this.localStorage?.setItem(this.TOKEN_KEY, token);
  }

  // xoa token trong localStorage
  removeToken(): void {
    this.localStorage?.removeItem(this.TOKEN_KEY);
    // localStorage.setItem(this.TOKEN_KEY, JSON.stringify({}));
    // localStorage.setItem(this.USER_KEY, JSON.stringify({}));
  }

  getUserId(): number {
    debugger;
    const token = this.getToken();

    if (!token) {
      return 0; // Token không tồn tại, trả về 0 hoặc giá trị mặc định phù hợp
    }
    const userObject = this.jwtHelper.decodeToken(token);
    if (!userObject || !('id' in userObject)) {
      return 0; // Không thể giải mã token hoặc không có thuộc tính 'id', trả về 0
    }

    return parseInt(userObject['id']);
  }

  getUserInfoFromTokenn(): any {
    debugger
    return this.jwtHelper.decodeToken(this.getToken() ?? '');
  }
  isTokenExpired(): boolean {
    debugger
    const tokenJSON = this.getToken();
    if (tokenJSON == null || tokenJSON == '{}') {
      return false;
    }
    return this.jwtHelper.isTokenExpired(this.getToken()!);
  }
}


