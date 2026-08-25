import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CustomFieldService,
  CreateCustomFieldRequest
} from '../../core/services/custom-field.service';

import { CustomField } from '../../shared/models/custom-field.model';

@Component({
  selector: 'app-custom-fields',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './custom-fields.component.html',
  styleUrl: './custom-fields.component.css'
})
export class CustomFieldsComponent implements OnInit {

  customFields: CustomField[] = [];

  filteredFields: CustomField[] = [];

  searchTerm = '';

  loading = false;

  errorMessage = '';

  successMessage = '';

  showForm = false;

  editingField: CustomField | null = null;

  fieldName = '';

  fieldType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' = 'TEXT';

  constructor(
    private customFieldService: CustomFieldService
  ) {}

  ngOnInit(): void {
    this.loadCustomFields();
  }

  loadCustomFields(): void {

    this.loading = true;
    this.errorMessage = '';

    this.customFieldService.getAllCustomFields().subscribe({

      next: (fields) => {

        this.customFields = fields;

        this.filteredFields = fields;

        this.loading = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          '';

        this.loading = false;
      }

    });
  }

  searchFields(): void {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    if (!search) {

      this.filteredFields = this.customFields;

      return;
    }

    this.filteredFields = this.customFields.filter(
      field =>
        field.name.toLowerCase().includes(search) ||
        field.type.toLowerCase().includes(search)
    );
  }

  openCreateForm(): void {

    this.editingField = null;

    this.fieldName = '';

    this.fieldType = 'TEXT';

    this.errorMessage = '';

    this.successMessage = '';

    this.showForm = true;
  }

  openEditForm(field: CustomField): void {

    this.editingField = field;

    this.fieldName = field.name;

    this.fieldType = field.type;

    this.errorMessage = '';

    this.successMessage = '';

    this.showForm = true;
  }

  closeForm(): void {

    this.showForm = false;

    this.editingField = null;

    this.fieldName = '';

    this.fieldType = 'TEXT';
  }

  saveField(): void {

    if (!this.fieldName.trim()) {

      this.errorMessage =
        'Custom field name is required.';

      return;
    }

    const request: CreateCustomFieldRequest = {

      name: this.fieldName.trim(),

      type: this.fieldType

    };

    this.errorMessage = '';

    this.successMessage = '';

    if (this.editingField) {

      this.customFieldService
        .updateCustomField(
          this.editingField.id,
          request
        )
        .subscribe({

          next: () => {

            this.successMessage =
              'Custom field updated successfully.';

            this.closeForm();

            this.loadCustomFields();

          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              'Unable to update custom field.';
          }

        });

    } else {

      this.customFieldService
        .createCustomField(request)
        .subscribe({

          next: () => {

            this.successMessage =
              'Custom field created successfully.';

            this.closeForm();

            this.loadCustomFields();

          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              'Unable to create custom field.';
          }

        });
    }
  }

  deleteField(field: CustomField): void {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${field.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';

    this.successMessage = '';

    this.customFieldService
      .deleteCustomField(field.id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Custom field deleted successfully.';

          this.loadCustomFields();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Unable to delete custom field.';
        }

      });
  }

  getTypeLabel(type: CustomField['type']): string {

    switch (type) {

      case 'TEXT':
        return 'Text';

      case 'NUMBER':
        return 'Number';

      case 'BOOLEAN':
        return 'Boolean';

      case 'DATE':
        return 'Date';

      default:
        return type;
    }
  }

  getTypeIcon(type: CustomField['type']): string {

    switch (type) {

      case 'TEXT':
        return 'Aa';

      case 'NUMBER':
        return '#';

      case 'BOOLEAN':
        return '✓';

      case 'DATE':
        return '◷';

      default:
        return '?';
    }
  }
  getTypeCount(type: CustomField['type']): number {

  return this.customFields.filter(
    field => field.type === type
  ).length;
}

getOtherFieldCount(): number {

  return this.customFields.filter(
    field => field.type !== 'TEXT'
  ).length;
}
}