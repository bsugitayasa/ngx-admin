import {NbAuthService} from './@auth/services/auth.service';
import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: NbAuthService, private router: Router) {
  }

  canActivate() {
    return this.authService.isAuthenticated()
    .do(authenticated => {
      if (!authenticated) {
        this.router.navigate(['auth/login']);
      }
    });
  }
}
