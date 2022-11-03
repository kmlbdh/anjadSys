import { Component, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

export interface userLocalStorage {
  accesstoken: string;
  username: string;
  companyName: string;
   id: string;
   role: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    let elementNativeHTML = (this.elementRef.nativeElement as HTMLElement);
    if (!elementNativeHTML.contains(target) && !elementNativeHTML.contains(target.parentElement)) {
      this.openDropdownMenu = false;
    }
  }

  openDropdownMenu = false;
  user: userLocalStorage = {} as userLocalStorage;

  constructor(private router: Router, private elementRef: ElementRef) {
    this.getUsename();
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  getUsename() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  openProfileDropdown() {
    this.openDropdownMenu = !this.openDropdownMenu;
  }

}
