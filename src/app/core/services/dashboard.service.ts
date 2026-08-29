import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Dashboard } from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl = 'https://crm-3dip.onrender.com/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.apiUrl);
  }
}