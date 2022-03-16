import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { faBars, faCarCrash, faCarSide, faFileInvoiceDollar, faWrench } from '@fortawesome/free-solid-svg-icons';
import { UserLoggedInAPI } from '../../model/general';
import { faUsers, faUserTie, faTruckLoading, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { NavInput } from '../../../shared/components/nav/nav.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  faBars = faBars;
  user!: UserLoggedInAPI;

  navData: NavInput[] = [
    {
      id: 1,
      name: 'مستخدمي النظام',
      faIcon: faUsers,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار المستخدمين',
          link: 'user/show'
        },
        {
          id: 2,
          name: 'اضافة مستخدم جديد',
          link: 'user/add'
        },
      ]
    },
    {
      id: 2,
      name: 'الوكيل',
      faIcon: faUserTie,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الوكلاء',
          link: 'agent/show'
        },
        {
          id: 2,
          name: 'اضافة سقف مالي للوكيل',
          link: 'agent/add-agent-limit'
        },
      ]
    },
    {
      id: 2,
      name: 'الموردين',
      faIcon: faTruckLoading,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الموردين',
          link: 'supplier/show'
        },
        // {
        //   name: 'اضافة قطع جديدة للمورد',
        //   link: 'supplier/add-supplier-parts'
        // },
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
        },
        {
          id: 2,
          name: 'اضافة خدمة جديدة ',
          link: 'service/add'
        },
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
          id: 2,
          name: 'اضافة نوع سيارة ',
          link: 'car/car-type/add'
        },
        {
          id: 3,
          name: 'اظهار موديلات السيارات',
          link: 'car/car-model/show'
        },
        {
          id: 4,
          name: 'اضافة موديل سيارة ',
          link: 'car/car-model/add'
        },
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
      faIcon: faCarCrash,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار بوليصات التأمين',
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
      id: 7,
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
  constructor(private adminService: AdminService, private router: Router) {
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

  verifyLoggedInAdmin(user: UserLoggedInAPI){
    this.adminService.verifyLoggedInAdmin(user.accessToken).subscribe({
      next: (res) =>{
        if(!res.data || res?.data?._id !== user.id)
          this.router.navigate(['login']);
      },
      error: err => this.router.navigate(['login'])
    })
  }

}
