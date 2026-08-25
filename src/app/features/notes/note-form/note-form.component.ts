import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';
import { NoteService } from '../../../core/services/note.service';

import { Customer } from '../../../shared/models/customer';
import { Note } from '../../../shared/models/note';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent implements OnInit {

  customers: Customer[] = [];

  note: Note = {
    content: '',
    customer: {
      id: 0
    }
  };

  noteId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  constructor(
    private noteService: NoteService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadCustomers();

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.noteId = Number(id);
      this.isEditMode = true;

      this.loadNote(this.noteId);
    }
  }

  loadCustomers(): void {

    this.customerService
      .getAllCustomers()
      .subscribe({

        next: (data: Customer[]) => {

          this.customers = data;
        },

        error: (error) => {

          console.error(
            'Error loading customers:',
            error
          );

          this.errorMessage =
            'Unable to load customers.';
        }

      });
  }

  loadNote(id: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.noteService
      .getNoteById(id)
      .subscribe({

        next: (data: Note) => {

          this.note = data;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Error loading note:',
            error
          );

          this.errorMessage =
            'Unable to load note.';

          this.isLoading = false;
        }

      });
  }

  submit(form: NgForm): void {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;
    }

    if (
      !this.note.customer ||
      !this.note.customer.id
    ) {

      this.errorMessage =
        'Please select a customer.';

      return;
    }

    if (
      !this.note.content ||
      !this.note.content.trim()
    ) {

      this.errorMessage =
        'Please enter note content.';

      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request: Note = {

      content: this.note.content.trim(),

      customer: {
        id: Number(this.note.customer.id)
      }

    };

    if (this.isEditMode && this.noteId) {

      this.noteService
        .updateNote(
          this.noteId,
          request
        )
        .subscribe({

          next: () => {

            this.router.navigate(['/notes']);
          },

          error: (error) => {

            console.error(
              'Error updating note:',
              error
            );

            this.errorMessage =
              'Unable to update note. Please try again.';

            this.isSaving = false;
          }

        });

    } else {

      this.noteService
        .createNote(request)
        .subscribe({

          next: () => {

            this.router.navigate(['/notes']);
          },

          error: (error) => {

            console.error(
              'Error creating note:',
              error
            );

            this.errorMessage =
              'Unable to create note. Please try again.';

            this.isSaving = false;
          }

        });
    }
  }
}