import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomField } from '../../shared/models/custom-field.model';

export interface CreateCustomFieldRequest {
  name: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';
}

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {

  private readonly apiUrl = 'http://localhost:8080/api/custom-fields';

  constructor(private http: HttpClient) {}

  getAllCustomFields(): Observable<CustomField[]> {
    return this.http.get<CustomField[]>(this.apiUrl);
  }

  createCustomField(
    request: CreateCustomFieldRequest
  ): Observable<CustomField> {

    return this.http.post<CustomField>(
      this.apiUrl,
      request
    );
  }

  updateCustomField(
    id: number,
    request: CreateCustomFieldRequest
  ): Observable<CustomField> {

    return this.http.put<CustomField>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteCustomField(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}