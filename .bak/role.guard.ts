import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const role = localStorage.getItem('role'); // ambil langsung aja

    console.log('[RoleGuard] expected:', expectedRole, ' actual:', role);

    if (!role) {
      this.router.navigate(['/login']);
      return false;
    }

    // Jika role cocok, izinkan masuk
    if (role === expectedRole) return true;

    // Jika tidak cocok, arahkan ke dashboard yang sesuai tanpa looping
    if (role === 'admin') {
      this.router.navigateByUrl('/admin', { replaceUrl: true });
    } else if (role === 'user') {
      this.router.navigateByUrl('/user', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
    return false;
  }
}
