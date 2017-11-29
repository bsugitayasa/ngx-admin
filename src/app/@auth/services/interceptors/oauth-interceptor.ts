import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { NbAuthService } from '../auth.service';
import { NbAuthToken } from '../token.service';

@Injectable()
export class NbOAuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.authService.getToken()
      .switchMap((token: NbAuthToken) => {
        if (token) {
          const accessToken = `Bearer ${token.getAccessToken()}`;
          req = req.clone({
            setHeaders: {
              Authorization: accessToken,
            },
          });
        }
        return next.handle(req);
      });
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}
