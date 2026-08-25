import { CommonModule } from '@angular/common';

import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';

import { Customer } from '../../../shared/models/customer';

@Component({
  selector: 'app-customer-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './customer-details.component.html',

  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {

  customer: Customer | null = null;

  customerId: number | null = null;

  isLoading = false;

  isDeleting = false;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private customerService = inject(CustomerService);

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.router.navigate([
        '/customers'
      ]);

      return;

    }

    this.customerId = Number(id);

    this.loadCustomer();

  }

  loadCustomer(): void {

    if (this.customerId === null) {
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.customerService
      .getCustomerById(this.customerId)
      .subscribe({

        next: (customer: any) => {

          this.customer = customer;

          this.isLoading = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading customer:',
            error
          );

          this.errorMessage =
            'Unable to load customer details.';

          this.isLoading = false;

        }

      });

  }

  editCustomer(): void {

    if (this.customerId === null) {
      return;
    }

    this.router.navigate([
      '/customers',
      this.customerId,
      'edit'
    ]);

  }

  deleteCustomer(): void {

    if (this.customerId === null) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this customer? This action cannot be undone.'
      );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;

    this.customerService
      .deleteCustomer(this.customerId)
      .subscribe({

        next: () => {

          this.isDeleting = false;

          this.router.navigate([
            '/customers'
          ]);

        },

        error: (error: any) => {

          console.error(
            'Error deleting customer:',
            error
          );

          this.errorMessage =
            'Unable to delete customer. Please try again.';

          this.isDeleting = false;

        }

      });

  }

  goBack(): void {

    this.router.navigate([
      '/customers'
    ]);

  }

  getCustomerName(): string {

    if (!this.customer) {
      return '';
    }

    return `${this.customer.firstname} ${this.customer.lastname}`;

  }

  getInitials(): string {

    if (!this.customer) {
      return '';
    }

    const first =
      this.customer.firstname
        ?.charAt(0)
        .toUpperCase() || '';

    const last =
      this.customer.lastname
        ?.charAt(0)
        .toUpperCase() || '';

    return first + last;

  }

}