import {NbResetPasswordComponent} from './@auth/components/reset-password/reset-password.component';
import {NbRequestPasswordComponent} from './@auth/components/request-password/request-password.component';
import {NbLogoutComponent} from './@auth/components/logout/logout.component';
import {NbRegisterComponent} from './@auth/components/register/register.component';
import {NbLoginComponent} from './@auth/components/login/login.component';
import {NbAuthComponent} from './@auth/components/auth.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { 
    path: 'pages',     
    canActivate: [AuthGuard],
    loadChildren: 'app/pages/pages.module#PagesModule' 
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
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
