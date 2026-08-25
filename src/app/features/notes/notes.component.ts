import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NoteService } from '../../core/services/note.service';
import { Note } from '../../shared/models/note';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];

  isLoading = false;
  errorMessage = '';

  searchTerm = '';

  constructor(
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.noteService.getAllNotes().subscribe({

      next: (data: Note[]) => {

        this.notes = data;

        this.isLoading = false;
      },

      error: (error) => {

        console.error(
          'Error loading notes:',
          error
        );

        this.errorMessage =
          'Unable to load notes. Please try again.';

        this.isLoading = false;
      }

    });
  }

  get filteredNotes(): Note[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.notes.filter(note => {

      const content =
        note.content
          ?.toLowerCase() ?? '';

      const customerName =
        `${note.customer?.firstname ?? ''} ${note.customer?.lastname ?? ''}`
          .toLowerCase();

      const email =
        note.customer?.email
          ?.toLowerCase() ?? '';

      const company =
        note.customer?.company
          ?.toLowerCase() ?? '';

      return (
        !search ||
        content.includes(search) ||
        customerName.includes(search) ||
        email.includes(search) ||
        company.includes(search)
      );
    });
  }

  get totalNotes(): number {
    return this.notes.length;
  }

  getCustomerName(note: Note): string {

    const name =
      `${note.customer?.firstname ?? ''} ${note.customer?.lastname ?? ''}`
        .trim();

    return name || 'Unknown Customer';
  }

  getCustomerInitials(note: Note): string {

    const first =
      note.customer?.firstname
        ?.charAt(0)
        ?.toUpperCase() ?? '';

    const last =
      note.customer?.lastname
        ?.charAt(0)
        ?.toUpperCase() ?? '';

    return `${first}${last}` || '?';
  }

  getPreview(content: string): string {

    if (!content) {
      return '-';
    }

    if (content.length <= 120) {
      return content;
    }

    return content.substring(0, 120) + '...';
  }

  formatDate(date: string | undefined): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  deleteNote(note: Note): void {

    if (!note.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete the note for ${this.getCustomerName(note)}?`
      );

    if (!confirmed) {
      return;
    }

    this.noteService
      .deleteNote(note.id)
      .subscribe({

        next: () => {

          this.notes =
            this.notes.filter(
              item => item.id !== note.id
            );
        },

        error: (error) => {

          console.error(
            'Error deleting note:',
            error
          );

          if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to delete notes.';

          } else {

            this.errorMessage =
              'Unable to delete note. Please try again.';
          }
        }

      });
  }
}