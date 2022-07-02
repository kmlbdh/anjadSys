import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import {
  faUsers,
  faUserTie,
  faTaxi,
  faAngleDown,
  faAngleUp,
  faBars,
  faCarCrash,
  faCarSide,
  faFileInvoiceDollar,
  faTruckMoving,
  faWrench,
  faClipboardList,
  faFileMedicalAlt,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { UserLoggedInAPI } from '@models/general';
import { NavInput } from '@shared/components/nav/nav.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  faBarsIcon = faBars;
  angelDownIcon = faAngleDown;
  angelUpIcon = faAngleUp;

  user!: UserLoggedInAPI;
  openDropdownMenu = false;
  miniNavBar = false;
  state: 'small' | 'large' = 'large';

  navData: NavInput[] = [
    {
      id: 1,
      name: 'المستخدمين',
      faIcon: faUsers,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'user/show'
        },
        {
          id: 2,
          name: 'اضافة مستخدم',
          shortName: 'اضافة',
          link: 'user/add'
        },
      ]
    },
    {
      id: 2,
      name: 'الوكلاء',
      faIcon: faUserTie,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'agent/show'
        },
        {
          id: 2,
          name: 'اضافة سقف مالي',
          shortName: 'اضافة',
          link: 'agent/add-agent-limit'
        },
      ]
    },
    {
      id: 3,
      name: 'الموردين',
      faIcon: faTruckMoving,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'supplier/show'
        },
        // {
        //   name: 'اضافة قطع جديدة للمورد',
        //   link: 'supplier/add-supplier-parts'
        // },
      ]
    },
    {
      id: 4,
      name: 'الخدمات',
      faIcon: faWrench,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'service/show'
        },
        {
          id: 2,
          name: 'اضافة خدمة',
          shortName: 'اضافة',
          link: 'service/add'
        },
      ]
    },
    {
      id: 5,
      name: 'خدمات اخرى',
      faIcon: faClipboardList,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'otherservices/show'
        },
        {
          id: 2,
          name: 'اضافة خدمة',
          shortName: 'اضافة',
          link: 'otherservices/add'
        },
      ]
    },
    {
      id: 6,
      name: 'السيارات',
      faIcon: faTaxi,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'car/car-customer/show'
        },
        {
          id: 2,
          name: 'اضافة سيارة',
          shortName: 'اضافة',
          link: 'car/car-customer/add'
        },
      ]
    },
    {
      id: 7,
      name: 'نوع وموديل السيارات',
      faIcon: faCarSide,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار كل الانواع',
          shortName: 'الانواع',
          link: 'car/car-type/show'
        },
        {
          id: 2,
          name: 'اضافة نوع',
          shortName: 'اضافة',
          link: 'car/car-type/add'
        },
        {
          id: 3,
          name: 'اظهار كل الموديلات',
          shortName: 'الموديلات',
          link: 'car/car-model/show'
        },
        {
          id: 4,
          name: 'اضافة موديل',
          shortName: 'اضافة',
          link: 'car/car-model/add'
        },
      ]
    },
    {
      id: 8,
      name: 'بلاغات الحوادث',
      faIcon: faCarCrash,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'accident/show'
        },
        {
          id: 2,
          name: 'اضافة بلاغ حادث',
          shortName: 'اضافة',
          link: 'accident/add'
        }
      ]
    },
    {
      id: 9,
      name: 'بوالص التأمين',
      faIcon: faFileMedicalAlt,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'insurance-policy/show'
        },
        {
          id: 2,
          name: 'اضافة بوليصة تأمين',
          shortName: 'اضافة',
          link: 'insurance-policy/add'
        }
      ]
    },
    {
      id: 10,
      name: 'الملاحق',
      faIcon: faFolderOpen,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الكل',
          shortName: 'اظهار',
          link: 'endorsement/show'
        },
        {
          id: 2,
          name: 'اضافة ملحق',
          shortName: 'اضافة',
          link: 'endorsement/add'
        },
      ]
    },
    {
      id: 11,
      name: 'المالية',
      faIcon: faFileInvoiceDollar,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار كل الحساب',
          shortName: 'اظهار',
          link: 'account/show'
        }
      ]
    },
  ];
  constructor(private adminService: AdminService, private router: Router) {
  }

  ngOnInit(): void {
    const localStorageUser: string = localStorage.getItem('user') || '';
    if (!localStorageUser)
    { this.router.navigate(['']); }

    this.user = JSON.parse(localStorageUser);
    if (!this.user.accessToken)
    { this.router.navigate(['']); }
  }

  minimizeNavBar() {
    this.miniNavBar = !this.miniNavBar;
    this.state = this.miniNavBar ? 'small': 'large';
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  verifyLoggedIn(user: UserLoggedInAPI) {
    this.adminService.verifyLoggedIn(user.accessToken).subscribe({
      next: res => {
        if (!res.data || res?.data?._id !== user.id)
        { this.router.navigate(['login']); }
      },
      error: () => this.router.navigate(['login'])
    });
  }

}
