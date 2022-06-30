import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { NavInput } from '../../models/nav';
export { NavInput } from '../../models/nav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {

  @Input()
  @HostBinding('attr.data-state') state: 'small' | 'large' = 'large';

  @Input() navData!: NavInput[];
  @Input() miniNavBar: Boolean = false;

  chevronLeftIcon = faChevronLeft;

  constructor() { }

  trackById(index: number, el: any) {
    return el.id;
  }

}
