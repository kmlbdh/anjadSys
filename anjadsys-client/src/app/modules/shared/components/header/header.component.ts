import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faAngleDown, faAngleUp, faBars } from '@fortawesome/free-solid-svg-icons';
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
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() miniNavBar!: boolean;
  @Output() miniNavBarChange: EventEmitter<boolean> = new EventEmitter();

  @Input() navBarState!: 'small' | 'large';
  @Output() navBarStateChange: EventEmitter<'small' | 'large'> = new EventEmitter();

  @Input() routeLinker!: string;

  faBarsIcon = faBars;
  angelDownIcon = faAngleDown;
  angelUpIcon = faAngleUp;
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

}
