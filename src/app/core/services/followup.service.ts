import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FollowUp } from '../../shared/models/followup';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {

  private apiUrl = 'http://localhost:8080/api/followups';

  constructor(private http: HttpClient) {}

  getAllFollowUps(): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(this.apiUrl);
  }

  getFollowUpById(id: number): Observable<FollowUp> {
    return this.http.get<FollowUp>(`${this.apiUrl}/${id}`);
  }

  createFollowUp(data: any): Observable<FollowUp> {
    return this.http.post<FollowUp>(
      this.apiUrl,
      data
    );
  }

  updateFollowUp(
    id: number,
    data: any
  ): Observable<FollowUp> {
    return this.http.put<FollowUp>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteFollowUp(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}