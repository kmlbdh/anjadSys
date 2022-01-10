import { Component, OnInit } from '@angular/core';
import { faUsers, faChevronLeft, faUserTie, faTruckLoading } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  usersIcon = faUsers;
  usersTieIcon = faUserTie;
  chevronLeftIcon = faChevronLeft;
  truckLoadIcon = faTruckLoading;
  navShow: {
    showUser: boolean,
    showAgent: boolean,
    showSupplier: boolean
    showService: boolean
  } = {
    showUser: false,
    showAgent: false,
    showSupplier: false,
    showService: false,
  }

  navData = [
    {
      name: 'مستخدمي النظام',
      faIcon: faUsers,
      hide: true,
      children: [
        {
          name: 'اظهار المستخدمين',
          routeLink: 'show-users'
        },
        {
          name: 'اضافة مستخدم جديد',
          routeLink: 'add-user'
        },
      ]
    },
    {
      name: 'الوكيل',
      faIcon: faUserTie,
      hide: true,
      children: [
        {
          name: 'اظهار الوكلاء',
          routeLink: 'show-agents'
        },
        {
          name: 'اضافة سقف مالي للوكيل',
          routeLink: 'add-agent-limit'
        },
      ]
    },
    {
      name: 'الموردين',
      faIcon: faTruckLoading,
      hide: true,
      children: [
        {
          name: 'اظهار الموردين',
          routeLink: 'show-supplier'
        },
        {
          name: 'اضافة قطع جديدة للمورد',
          routeLink: 'add-supplier-parts'
        },
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {}

  trackByName(index: number, el: any){
    return el.name;
  }

}
