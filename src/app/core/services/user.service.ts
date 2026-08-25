import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangeRoleRequest,
  ChangeStatusRequest,
  UserStatus
} from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, request);
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, request);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changeUserRole(id: number, role: string): Observable<User> {
    const request: ChangeRoleRequest = {
      role: role
    };

    return this.http.put<User>(
      `${this.apiUrl}/${id}/role`,
      request
    );
  }

  changeUserStatus(id: number, status: UserStatus): Observable<User> {
    const request: ChangeStatusRequest = {
      status: status
    };

    return this.http.put<User>(
      `${this.apiUrl}/${id}/status`,
      request
    );
  }
}