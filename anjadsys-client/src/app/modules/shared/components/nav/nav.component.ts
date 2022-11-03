import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output } from '@angular/core';
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
  @Input() routeLinker!: string;
  @Output() tiggerState: EventEmitter<boolean> = new EventEmitter<boolean>();

  miniNavBar: boolean = false;
  navBarState: 'small' | 'large' = 'large';

  constructor() { }

  trackById(_index: number, el: any) {
    return el.id;
  }

  minimizeNavBar() {
    this.miniNavBar = !this.miniNavBar;
    this.navBarState = this.miniNavBar ? 'large': 'small';
    this.tiggerState.emit(this.miniNavBar);
  }

}
