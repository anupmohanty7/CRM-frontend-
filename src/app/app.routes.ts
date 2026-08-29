import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './features/public-layout/public-layout.component';
import { CRMLayoutComponent } from './features/crmlayout/crmlayout.component';

import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/login/login.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';

import { CustomersComponent } from './features/customers/customers.component';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form.component';
import { CustomerDetailsComponent } from './features/customers/customer-details/customer-details.component';

import { authGuard } from './core/guards/auth.guard';
import { FollowupsComponent } from './features/followups/followups.component';
import { FollowupFormComponent } from './features/followups/followup-form/followup-form.component';
import { NoteFormComponent } from './features/notes/note-form/note-form.component';
import { NotesComponent } from './features/notes/notes.component';
import { RegisterComponent } from './features/register/register.component';

export const routes: Routes = [



  {
    path: '',
    component: PublicLayoutComponent,

    children: [

  {
    path: '',
    component: LandingComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  }

]

  },


  {
    path: '',
    component: CRMLayoutComponent,

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      },

      {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [authGuard]
      },

      {
        path: 'customers/new',
        component: CustomerFormComponent,
        canActivate: [authGuard]
      },

      {
        path: 'customers/:id',
        component: CustomerDetailsComponent,
        canActivate: [authGuard]
      },

      {
        path: 'customers/:id/edit',
        component: CustomerFormComponent,
        canActivate: [authGuard]
      },
      {
        path: 'followups',
        component: FollowupsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'followups/add',
        component: FollowupFormComponent,
        canActivate: [authGuard]
      },
      {
        path: 'followups/:id/edit',
        component: FollowupFormComponent,
        canActivate: [authGuard]
      },
      {
        path: 'notes',
        component: NotesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'notes/new',
        component: NoteFormComponent,
        canActivate: [authGuard]
      },
      {
        path: 'notes/edit/:id',
        component: NoteFormComponent,
        canActivate: [authGuard]
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component')
            .then(m => m.UsersComponent)
      },
      {
        path: 'custom-fields',
        loadComponent: () =>
          import('./features/custom-fields/custom-fields.component')
            .then(m => m.CustomFieldsComponent)
      }

    ]

  }

];