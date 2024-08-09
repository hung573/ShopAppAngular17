import { TokenService } from './token.service';
import { LoginDTO } from './../dtos/user/login.dto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { environment } from '../enviroments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../reponses/user/user.response';
import { UserUpdateDTO } from '../dtos/user/user.update.dto';
import { DOCUMENT } from '@angular/common';
import { UserAdminUpdateDTO } from '../dtos/user/user.admin.update';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrlUser = `${environment.apiBaseUrl}/users`;
  private apiCongig = {
    headers: this.httpUtilService.createHeaders(),
  };
  localStorage?: Storage;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    @Inject(DOCUMENT) private document: Document,
    private tokenService: TokenService
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }


  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrlUser}/resigter`, registerDTO, this.apiCongig);
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrlUser}/login`, loginDTO, this.apiCongig);
  }

  updateUser(token: string, userUpdateDTO: UserUpdateDTO): Observable<any> {
    debugger
    let userResponse = this.getUserToLocalStorage();
    return this.http.put(`${this.apiUrlUser}/details/${userResponse?.id}`, userUpdateDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  getUserDetails(token: string) {
    return this.http.post(
      `${this.apiUrlUser}/details`,
      {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  getUserDetailAdmin(userId: number) {
    return this.http.get(
      `${this.apiUrlUser}/admin/${userId}`
    );
  }

  updateUserAdmin(userId: number, updateUser: UserAdminUpdateDTO): Observable<UserAdminUpdateDTO> {
    debugger
    return this.http.put<UserAdminUpdateDTO>(`${this.apiUrlUser}/admin/update/${userId}`, updateUser);
  }

  deleteUserAdmin(userId: number, active: number) {
    debugger
    return this.http.delete(`${this.apiUrlUser}/delete/${userId}/${active}`);
  }

  saveUserToLocalStorage(userResponse?: UserResponse) {
    try {
      debugger;
      if (userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a Json string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the Json string to local storage with a key 'userResponse'
      this.localStorage?.setItem('user', userResponseJSON);

      console.log('userResponse saved to local storage');
    } catch (error) {
      console.error('Error saving userResponse to local storage: ', error);
    }
  }

  getUserToLocalStorage(): UserResponse | null {
    try {
      debugger
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined || userResponseJSON == '{}') {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      return userResponse;
    } catch (error) {
      console.error('Error get user to local storage: ', error);
      return null;
    }
  }

  removeUserToLocalStorage(): void {
    try {
      // localStorage.removeItem('user');
      this.localStorage?.setItem('user', JSON.stringify({}));
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }

  convertToISODate(dateString: string, timeZone: string): string {
    const date = new Date(dateString);
    const dateStringInTimeZone = date.toLocaleString('en-GB', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const [day, month, year] = dateStringInTimeZone.split('/');
    return `${year}-${month}-${day}`;
  }

  getTokenToDB(token: string) {
    debugger
    return this.http.post(
      `${this.apiUrlUser}/check`,
      {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  refreshToken(refreshToken: string) {

  }

  getAllUsers(keyword: string,
    page: number, limit: number): Observable<UserResponse[]> {
    debugger;
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<UserResponse[]>(this.apiUrlUser, { params });
  }


}
