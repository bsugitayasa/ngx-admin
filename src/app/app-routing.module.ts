import {NgxResetPasswordComponent} from './@auth/components/reset-password/reset-password.component';
import {NgxRequestPasswordComponent} from './@auth/components/request-password/request-password.component';
import {NgxLogoutComponent} from './@auth/components/logout/logout.component';
import {NgxRegisterComponent} from './@auth/components/register/register.component';
import {NgxLoginComponent} from './@auth/components/login/login.component';
import {NgxAuthComponent} from './@auth/components/auth.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: 'app/pages/pages.module#PagesModule',
  },
  {
    path: 'auth',
    component: NgxAuthComponent,
    children: [
      {
        path: '',
        component: NgxLoginComponent,
      },
      {
        path: 'login',
        component: NgxLoginComponent,
      },
      {
        path: 'register',
        component: NgxRegisterComponent,
      },
      {
        path: 'logout',
        component: NgxLogoutComponent,
      },
      {
        path: 'request-password',
        component: NgxRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NgxResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
