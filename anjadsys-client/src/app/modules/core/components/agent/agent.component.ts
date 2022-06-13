import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faCarCrash, faCarSide, faFileInvoiceDollar, faTaxi, faUsers, faWrench, faAngleDown, faAngleUp, faFileMedicalAlt } from '@fortawesome/free-solid-svg-icons';
import { NavInput } from 'src/app/modules/shared/components/nav/nav.component';
import { UserLoggedInAPI } from '../../model/general';
import { AgentService } from './agent.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  faBarsIcon = faBars;
  angelDownIcon = faAngleDown;
  angelUpIcon = faAngleUp;

  user!: UserLoggedInAPI;
  openDropdownMenu = false;

  navData: NavInput[] = [
    {
      id: 1,
      name: 'الزبائن',
      faIcon: faUsers,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الزبائن',
          link: 'user/show'
        },
        {
          id: 2,
          name: 'اضافة زبون جديد',
          link: 'user/add'
        },
      ]
    },
    {
      id: 3,
      name: 'الخدمات',
      faIcon: faWrench,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الخدمات',
          link: 'service/show'
        }
      ]
    },
    {
      id: 4,
      name: 'السيارات',
      faIcon: faTaxi,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار سيارات الزبائن',
          link: 'car/car-customer/show'
        },
        {
          id: 2,
          name: 'اضافة سيارة جديدة ',
          link: 'car/car-customer/add'
        },
      ]
    },
    {
      id: 5,
      name: 'نوع وموديل السيارات',
      faIcon: faCarSide,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار انواع السيارات',
          link: 'car/car-type/show'
        },
        {
          id: 3,
          name: 'اظهار موديلات السيارات',
          link: 'car/car-model/show'
        }
      ]
    },
    {
      id: 6,
      name: 'بلاغات الحوادث',
      faIcon: faCarCrash,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار بلاغات الحوادث',
          link: 'accident/show'
        },
        {
          id: 2,
          name: 'اضافة بلاغ عن حادث جديد ',
          link: 'accident/add'
        }
      ]
    },
    {
      id: 7,
      name: 'بوليصة التأمين',
      faIcon: faFileMedicalAlt,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار بوالص التأمين',
          link: 'insurance-policy/show'
        },
        {
          id: 2,
          name: 'اضافة بوليصة تأمين جديدة ',
          link: 'insurance-policy/add'
        }
      ]
    },
    {
      id: 8,
      name: 'المالية',
      faIcon: faFileInvoiceDollar,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الحساب المالي ',
          link: 'account/show'
        }
      ]
    },
  ];
  constructor(private agentService: AgentService, private router: Router) {
  }

  ngOnInit(): void {
    const localStorageUser: string = localStorage.getItem('user') || '';
    if(!localStorageUser)
      this.router.navigate(['']);

    this.user = JSON.parse(localStorageUser);
    if(!this.user.accessToken)
      this.router.navigate(['']);
  }

  profilePop(){

  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  verifyLoggedInAdmin(user: UserLoggedInAPI){
    this.agentService.verifyLoggedInAdmin(user.accessToken).subscribe({
      next: (res) =>{
        if(!res.data || res?.data?._id !== user.id)
          this.router.navigate(['login']);
      },
      error: err => this.router.navigate(['login'])
    })
  }
}
