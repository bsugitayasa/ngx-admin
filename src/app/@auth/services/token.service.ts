import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { NB_AUTH_OPTIONS_TOKEN, NB_AUTH_TOKEN_WRAPPER_TOKEN } from '../auth.options';
import { deepExtend, getDeepFromObject, urlBase64Decode } from '../helpers';

@Injectable()
export class NbAuthToken {

  protected accessToken: string = '';
  protected expiresIn: any;
  protected refreshToken: string = '';
  protected tokenType: string = '';
  protected scope: string = '';

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  /* getTokenExpDate(): Date {
    const decoded = this.getPayload();
    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  } */
}

@Injectable()
export class NbTokenService {

  protected defaultConfig: any = {
    token: {
      key: 'access_token',

      getter: (): Observable<NbAuthToken> => {
        const tokenValue = localStorage.getItem(this.getConfigValue('token.key'));
        this.tokenWrapper.setAccessToken(tokenValue);
        return Observable.of(this.tokenWrapper);
      },

      setter: (token: string|NbAuthToken): Observable<null> => {
        const raw = token instanceof NbAuthToken ? token.getAccessToken() : token;
        localStorage.setItem(this.getConfigValue('token.key'), raw);
        return Observable.of(null);
      },

      deleter: (): Observable<null> => {
        localStorage.removeItem(this.getConfigValue('token.key'));
        return Observable.of(null);
      },
    },
  };
  protected config: any = {};
  protected token$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(@Inject(NB_AUTH_OPTIONS_TOKEN) protected options: any,
              @Inject(NB_AUTH_TOKEN_WRAPPER_TOKEN) protected tokenWrapper: NbAuthToken) {
    this.setConfig(options);

    this.get().subscribe(token => this.publishToken(token));
  }

  setConfig(config: any): void {
    this.config = deepExtend({}, this.defaultConfig, config);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }

  /**
   * Sets the token into the storage. This method is used by the NbAuthService automatically.
   * @param {string} rawToken
   * @returns {Observable<any>}
   */
  set(rawToken: string): Observable<null> {
    return this.getConfigValue('token.setter')(rawToken)
      .switchMap(_ => this.get())
      .do((token: NbAuthToken) => {
        this.publishToken(token);
      });
  }

  /**
   * Returns observable of current token
   * @returns {Observable<NbAuthToken>}
   */
  get(): Observable<NbAuthToken> {
    return this.getConfigValue('token.getter')();
  }

  /**
   * Publishes token when it changes.
   * @returns {Observable<NbAuthToken>}
   */
  tokenChange(): Observable<NbAuthToken> {
    return this.token$.publish().refCount();
  }

  /**
   * Removes the token
   * @returns {Observable<any>}
   */
  clear(): Observable<any> {
    this.publishToken(null);

    return this.getConfigValue('token.deleter')();
  }

  protected publishToken(token: NbAuthToken): void {
    this.token$.next(token);
  }
}
