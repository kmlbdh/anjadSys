import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface ChildNav{
    id: number,
    name: string,
    link: string
}

export interface NavInput{
    id: number,
    name: string,
    faIcon: any,
    hide: boolean,
    children: ChildNav[]
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {
  @Input() navData!: NavInput[];
  chevronLeftIcon = faChevronLeft;
  constructor() { }

  ngOnInit(): void {}

  trackById(index: number, el: any){
    return el.id;
  }
}
