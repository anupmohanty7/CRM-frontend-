import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  private readonly tokenKey = 'leadhelp_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {

    const loginRequest: LoginRequest = {
      email,
      password
    };

    return this.http
      .post(
        `${this.apiUrl}/login`,
        loginRequest,
        {
          responseType: 'text'
        }
      )
      .pipe(
        tap(token => {
          this.setToken(token);
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    this.removeToken();
  }
}