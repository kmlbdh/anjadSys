import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const localStorageUser: string = localStorage.getItem('user') || '';
    if (!localStorageUser) {
      this.router.navigate(['']);
      return false;
    }

    const user = JSON.parse(localStorageUser);
    if (!user.accessToken) {
      localStorage.removeItem('user');
      this.router.navigate(['']);
      return false;
    }

    if (route.routeConfig?.path !== user.role) {
      localStorage.removeItem('user');
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}

// verifyLoggedIn(user: UserLoggedInAPI) {
//   this.adminService.verifyLoggedIn(user.accessToken).subscribe({
//     next: res => {
//       if (!res.data || res?.data?._id !== user.id)
//       { this.router.navigate(['login']); }
//     },
//     error: () => this.router.navigate(['login'])
//   });
// }

