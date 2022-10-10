import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
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

  @Input() miniNavBar!: boolean;
  @Output() miniNavBarChange: EventEmitter<boolean> = new EventEmitter();

  @Input() navBarState!: 'small' | 'large';
  @Output() navBarStateChange: EventEmitter<'small' | 'large'> = new EventEmitter();

  @Input() routeLinker!: string;

  openDropdownMenu = false;
  user: userLocalStorage = {} as userLocalStorage;

  constructor(private router: Router) {
    this.getUsename();
  }

  minimizeNavBar() {
    this.miniNavBarChange.emit(!this.miniNavBar);
    this.navBarStateChange.emit(this.miniNavBar ? 'large': 'small');
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
