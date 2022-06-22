import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  @Input() navData!: NavInput[];
  chevronLeftIcon = faChevronLeft;

  constructor() { }

  trackById(index: number, el: any) {
    return el.id;
  }

}
