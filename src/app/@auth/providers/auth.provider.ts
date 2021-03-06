/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient,  HttpResponse,  HttpErrorResponse} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NbAuthResult } from '../services/auth.service';
import { NbAbstractAuthProvider } from './abstract-auth.provider';
import { getDeepFromObject } from '../helpers';
import { NgAuthProviderConfig } from '../auth.options';

@Injectable()
export class NbAuthProvider extends NbAbstractAuthProvider {

  protected defaultConfig: NgAuthProviderConfig = {
    baseEndpoint: 'http://s201403171-desktop.local:8082',
    login: {
      alwaysFail: false,
      rememberMe: true,
      endpoint: '/oauth/token',
      method: 'POST',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: ['Login/Email combination is not correct, please try again.'],
      defaultMessages: ['You have been successfully logged in.'],
    },
    register: {
      alwaysFail: false,
      rememberMe: true,
      endpoint: '/api/auth/register',
      method: 'POST',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['You have been successfully registered.'],
    },
    logout: {
      alwaysFail: false,
      endpoint: '/oauth/token',
      method: 'DELETE',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['You have been successfully logged out.'],
    },
    requestPass: {
      endpoint: '/api/auth/request-pass',
      method: 'post',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['Reset password instructions have been sent to your email.'],
    },
    resetPass: {
      endpoint: '/api/auth/reset-pass',
      method: 'put',
      redirect: {
        success: '/',
        failure: null,
      },
      resetPasswordTokenKey: 'reset_password_token',
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['Your password has been successfully changed.'],
    },
    security: {
      clientId: 'fooClientIdPassword',
      clientSecret: 'secret',
      grantType: 'password',
    },
    token: {
      key: 'data.token',
      getter: (module: string, res: HttpResponse<Object>) => getDeepFromObject(res.body,
        'access_token'),
    },
    errors: {
      key: 'data.errors',
      getter: (module: string, res: HttpErrorResponse) => getDeepFromObject(res.error,
        this.getConfigValue('errors.key'),
        this.getConfigValue(`${module}.defaultErrors`)),
    },
    messages: {
      key: 'data.messages',
      getter: (module: string, res: HttpResponse<Object>) => getDeepFromObject(res.body,
        this.getConfigValue('messages.key'),
        this.getConfigValue(`${module}.defaultMessages`)),
    },
  };

  constructor(protected http: HttpClient, private route: ActivatedRoute) {
    super();
  }

  authenticate(data?: any): Observable<NbAuthResult> {
    const method = this.getConfigValue('login.method');
    const url = this.getActionEndpoint('login');
    const clientId = this.getConfigValue('security.clientId');
    const clientSecret = this.getConfigValue('security.clientSecret');
    const grantType = 'grant_type=' + this.getConfigValue('security.grantType');
    const username = 'username=' + data.username;
    const password = 'password=' + data.password;
    const body = grantType + '&' + username + '&' + password;
    const headers = new HttpHeaders(
      {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret),
      },
    );
    return this.http.request(method, url, { body: body, headers: headers, observe: 'response' })
      .map((res) => {
        if (this.getConfigValue('login.alwaysFail')) {
          throw this.createFailResponse(data);
        }

        return res;
      })
      .map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getConfigValue('login.redirect.success'),
          [],
          this.getConfigValue('messages.getter')('login', res),
          this.getConfigValue('token.getter')('login', res));
      })
      .catch((res) => {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
          errors = this.getConfigValue('errors.getter')('login', res);
        } else {
          errors.push('Something went wrong.');
        }

        return Observable.of(
          new NbAuthResult(
            false,
            res,
            this.getConfigValue('login.redirect.failure'),
            errors,
          ));
      });
  }

  register(data?: any): Observable<NbAuthResult> {
    const method = this.getConfigValue('register.method');
    const url = this.getActionEndpoint('register');
    return this.http.request(method, url, { body: data, observe: 'response' })
      .map((res) => {
        if (this.getConfigValue('register.alwaysFail')) {
          throw this.createFailResponse(data);
        }

        return res;
      })
      .map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getConfigValue('register.redirect.success'),
          [],
          this.getConfigValue('messages.getter')('register', res),
          this.getConfigValue('token.getter')('register', res));
      })
      .catch((res) => {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
          errors = this.getConfigValue('errors.getter')('register', res);
        } else {
          errors.push('Something went wrong.');
        }

        return Observable.of(
          new NbAuthResult(
            false,
            res,
            this.getConfigValue('register.redirect.failure'),
            errors,
          ));
      });
  }

  requestPassword(data?: any): Observable<NbAuthResult> {
    const method = this.getConfigValue('requestPass.method');
    const url = this.getActionEndpoint('requestPass');
    return this.http.request(method, url, { body: data, observe: 'response' })
      .map((res) => {
        if (this.getConfigValue('requestPass.alwaysFail')) {
          throw this.createFailResponse();
        }

        return res;
      })
      .map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getConfigValue('requestPass.redirect.success'),
          [],
          this.getConfigValue('messages.getter')('requestPass', res));
      })
      .catch((res) => {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
          errors = this.getConfigValue('errors.getter')('requestPass', res);
        } else {
          errors.push('Something went wrong.');
        }

        return Observable.of(
          new NbAuthResult(
            false,
            res,
            this.getConfigValue('requestPass.redirect.failure'),
            errors,
          ));
      });
  }

  resetPassword(data: any = {}): Observable<NbAuthResult> {
    const tokenKey = this.getConfigValue('resetPass.resetPasswordTokenKey');
    data[tokenKey] = this.route.snapshot.queryParams[tokenKey];

    const method = this.getConfigValue('resetPass.method');
    const url = this.getActionEndpoint('resetPass');
    return this.http.request(method, url, { body: data, observe: 'response' })
      .map((res) => {
        if (this.getConfigValue('resetPass.alwaysFail')) {
          throw this.createFailResponse();
        }

        return res;
      })
      .map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getConfigValue('resetPass.redirect.success'),
          [],
          this.getConfigValue('messages.getter')('resetPass', res));
      })
      .catch((res) => {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
          errors = this.getConfigValue('errors.getter')('resetPass', res);
        } else {
          errors.push('Something went wrong.');
        }

        return Observable.of(
          new NbAuthResult(
            false,
            res,
            this.getConfigValue('resetPass.redirect.failure'),
            errors,
          ));
      });
  }

  logout(): Observable<NbAuthResult> {

    const method = this.getConfigValue('logout.method');
    const url = this.getActionEndpoint('logout');
    const clientId = this.getConfigValue('security.clientId');
    const clientSecret = this.getConfigValue('security.clientSecret');
    const headers = new HttpHeaders(
      {
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret),
      },
    );
    return Observable.of({})
      .switchMap((res: any) => {
        if (!url) {
          return Observable.of(res);
        }
        return this.http.request(method, url, { headers: headers, observe: 'response', responseType: 'text' });
      })
      .map((res) => {
        if (this.getConfigValue('logout.alwaysFail')) {
          throw this.createFailResponse();
        }

        return res;
      })
      .map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getConfigValue('logout.redirect.success'),
          [],
          this.getConfigValue('messages.getter')('logout', res));
      })
      .catch((res) => {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
          errors = this.getConfigValue('errors.getter')('logout', res);
        } else {
          errors.push('Something went wrong.');
        }

        return Observable.of(
          new NbAuthResult(
            false,
            res,
            this.getConfigValue('logout.redirect.failure'),
            errors,
          ));
      });
  }

  protected getActionEndpoint(action: string): string {
    const actionEndpoint: string = this.getConfigValue(`${action}.endpoint`);
    const baseEndpoint: string = this.getConfigValue('baseEndpoint');
    return baseEndpoint + actionEndpoint;
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
