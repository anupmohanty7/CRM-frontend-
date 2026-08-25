import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './customer-form.component.html',

  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit {

  customerForm!: FormGroup;

  isEditMode = false;

  customerId: number | null = null;

  isLoading = false;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.createForm();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;

      this.customerId = Number(id);

      this.loadCustomer(this.customerId);

    }

  }

  createForm(): void {

    this.customerForm = this.fb.group({

      firstname: [
        '',
        [
          Validators.required
        ]
      ],

      lastname: [
        '',
        [
          Validators.required
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required
        ]
      ],

      company: [
        ''
      ],

      address: [
        ''
      ],

      customerType: [
        'CUSTOMER',
        [
          Validators.required
        ]
      ],

      leadStatus: [
        null
      ],

      leadSource: [
        null
      ],

      status: [
        '',
        [
          Validators.required
        ]
      ]

    });

  }

  loadCustomer(id: number): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.customerService
      .getCustomerById(id)
      .subscribe({

        next: (customer) => {

          this.customerForm.patchValue({

            firstname: customer.firstname,

            lastname: customer.lastname,

            email: customer.email,

            phone: customer.phone,

            company: customer.company,

            address: customer.address,

            customerType: customer.customerType,

            leadStatus: customer.leadStatus,

            leadSource: customer.leadSource,

            status: customer.status

          });

          this.isLoading = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading customer:',
            error
          );

          this.errorMessage =
            'Unable to load customer. Please try again.';

          this.isLoading = false;

        }

      });

  }

  submit(): void {

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      return;

    }

    this.isLoading = true;

    this.errorMessage = '';

    const customerData =
      this.customerForm.value;

    /*
     * EDIT
     */

    if (
      this.isEditMode &&
      this.customerId !== null
    ) {

      this.customerService
        .updateCustomer(
          this.customerId,
          customerData
        )
        .subscribe({

          next: () => {

            this.isLoading = false;

            this.router.navigate([
              '/customers',
              this.customerId
            ]);

          },

          error: (error: any) => {

            console.error(
              'Error updating customer:',
              error
            );

            this.errorMessage =
              'Unable to update customer. Please try again.';

            this.isLoading = false;

          }

        });

      return;

    }

    /*
     * CREATE
     */

    this.customerService
      .createCustomer(customerData)
      .subscribe({

        next: (customer) => {

          this.isLoading = false;

          this.router.navigate([
            '/customers',
            customer.id
          ]);

        },

        error: (error: any) => {

          console.error(
            'Error creating customer:',
            error
          );

          this.errorMessage =
            'Unable to create customer. Please try again.';

          this.isLoading = false;

        }

      });

  }

  cancel(): void {

    if (
      this.isEditMode &&
      this.customerId !== null
    ) {

      this.router.navigate([
        '/customers',
        this.customerId
      ]);

    } else {

      this.router.navigate([
        '/customers'
      ]);

    }

  }

  get f() {

    return this.customerForm.controls;

  }

}