import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanActivateChild,
    UrlTree
  } from "@angular/router";
  import { Observable } from "rxjs";
  import { Injectable } from "@angular/core";
  import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";
  
  @Injectable()
  export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean | UrlTree > | Promise<boolean | UrlTree> | boolean  | UrlTree {
      return this.authService.user.pipe(
        map(user => {
          const isAuth = !!user;
          if (isAuth) {
            return true;
          }
          return this.router.createUrlTree(['/auth']);
        })
      )
    }
  
    canActivateChild(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean | UrlTree > | Promise<boolean | UrlTree> | boolean  | UrlTree  {
      return this.canActivate(route, state);
    }
  }