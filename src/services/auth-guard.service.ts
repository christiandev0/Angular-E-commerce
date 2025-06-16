import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        return true;
      } else {
        
        return this.router.navigate(['/homepage']);
      }
    } else {
      return false;
    } 
  }
}
