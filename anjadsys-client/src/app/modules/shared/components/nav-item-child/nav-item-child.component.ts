import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ChildNav } from '@shared/models/nav';

@Component({
  selector: 'app-nav-item-child',
  templateUrl: './nav-item-child.component.html',
  styleUrls: ['./nav-item-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavItemChildComponent {

  @Input() navItemChild!: ChildNav;
  @Input() miniNavBar!: Boolean;
  @Input() navItemHide!: Boolean;

  chevronLeftIcon = faChevronLeft;

  constructor() { }

  trackById(index: number, el: any) {
    return el.id;
  }

}
