import { Component, Input, OnInit } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface ChildNav{
    name: string,
    link: string
}

export interface NavInput{
    name: string,
    faIcon: any,
    hide: boolean,
    children: ChildNav[]
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() navData!: NavInput[];
  chevronLeftIcon = faChevronLeft;
  constructor() { }

  ngOnInit(): void {}

  trackByName(index: number, el: any){
    return el.name;
  }
}
