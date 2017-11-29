import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NbLayoutModule, NbCardModule, NbCheckboxModule } from '@nebular/theme';

import { NbAuthService } from './services/auth.service';
import { NbAuthProvider } from './providers/auth.provider';

import {
  defaultSettings,
  NB_AUTH_USER_OPTIONS_TOKEN,
  NB_AUTH_OPTIONS_TOKEN,
  NB_AUTH_PROVIDERS_TOKEN,
  NB_AUTH_TOKEN_WRAPPER_TOKEN,
  NbAuthOptions, NB_AUTH_INTERCEPTOR_HEADER,
} from './auth.options';

import { NgxAuthComponent } from './components/auth.component';
import { NbAuthToken, NbTokenService } from './services/token.service';

import { NgxAuthBlockComponent } from './components/auth-block/auth-block.component';
import { NgxLoginComponent } from './components/login/login.component';
import { NgxRegisterComponent } from './components/register/register.component';
import { NgxLogoutComponent } from './components/logout/logout.component';
import { NgxRequestPasswordComponent } from './components/request-password/request-password.component';
import { NgxResetPasswordComponent } from './components/reset-password/reset-password.component';

import { routes } from './auth.routes';
import { deepExtend } from './helpers';

export function nbAuthServiceFactory(config: any, tokenService: NbTokenService, injector: Injector) {
  const providers = config.providers || {};

  for (const key in providers) {
    if (providers.hasOwnProperty(key)) {
      const provider = providers[key];
      const object = injector.get(provider.service);
      object.setConfig(provider.config || {});
    }
  }

  return new NbAuthService(tokenService, injector, providers);
}

export function nbOptionsFactory(options) {
  return deepExtend(defaultSettings, options);
}

@NgModule({
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbCheckboxModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    NgxAuthComponent,
    NgxAuthBlockComponent,
    NgxLoginComponent,
    NgxRegisterComponent,
    NgxRequestPasswordComponent,
    NgxResetPasswordComponent,
    NgxLogoutComponent,
  ],
  exports: [
    NgxAuthComponent,
    NgxAuthBlockComponent,
    NgxLoginComponent,
    NgxRegisterComponent,
    NgxRequestPasswordComponent,
    NgxResetPasswordComponent,
    NgxLogoutComponent,
  ],
})
export class NbAuthModule {
  static forRoot(nbAuthOptions?: NbAuthOptions): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: NbAuthModule,
      providers: [
        { provide: NB_AUTH_USER_OPTIONS_TOKEN, useValue: nbAuthOptions },
        { provide: NB_AUTH_OPTIONS_TOKEN, useFactory: nbOptionsFactory, deps: [NB_AUTH_USER_OPTIONS_TOKEN] },
        { provide: NB_AUTH_PROVIDERS_TOKEN, useValue: {} },
        { provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: NbAuthToken },
        { provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
        {
          provide: NbAuthService,
          useFactory: nbAuthServiceFactory,
          deps: [NB_AUTH_OPTIONS_TOKEN, NbTokenService, Injector],
        },
        NbTokenService,
        NbAuthProvider,
      ],
    };
  }
}
