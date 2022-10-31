import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavInput } from '@shared/models/nav';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavItemComponent implements OnInit {

  @Input() navItem!: NavInput;
  @Input() miniNavBar!: Boolean;
  hideNav!: boolean;
  svgIcon!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.buildUpNavItem();
  }

  buildUpNavItem() {
    this.hideNav = this.navItem.hide;
    this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(this.navItem.svgIcon);
  }

  trackById(_index: number, el: any) {
    return el.id;
  }

  toggleNav(_event: Event) {
    this.navItem.hide = !this.navItem.hide;
    this.hideNav = this.navItem.hide;
  }

}
