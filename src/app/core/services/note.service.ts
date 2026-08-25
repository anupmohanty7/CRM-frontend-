import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Note } from '../../shared/models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = 'http://localhost:8080/api/notes';

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  getNoteById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  createNote(data: Note): Observable<Note> {
    return this.http.post<Note>(
      this.apiUrl,
      data
    );
  }

  updateNote(id: number, data: Note): Observable<Note> {
    return this.http.put<Note>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}