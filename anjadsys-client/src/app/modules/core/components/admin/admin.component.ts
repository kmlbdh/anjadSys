import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
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
      name: 'مستخدمي النظام',
      faIcon: faUsers,
      hide: true,
      children: [
        {
          name: 'اظهار المستخدمين',
          link: 'user/show-users'
        },
        {
          name: 'اضافة مستخدم جديد',
          link: 'user/add-user'
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
          link: 'agent/show-agents'
        },
        {
          name: 'اضافة سقف مالي للوكيل',
          link: 'agent/add-agent-limit'
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
          link: 'supplier/show-supplier'
        },
        {
          name: 'اضافة قطع جديدة للمورد',
          link: 'supplier/add-supplier-parts'
        },
      ]
    },
    {
      name: 'الخدمات',
      faIcon: faTaxi,
      hide: true,
      children: [
        {
          name: 'اظهار الخدمات',
          link: 'service/show-services'
        },
        {
          name: 'اضافة خدمة جديدة ',
          link: 'service/add-service'
        },
      ]
    }
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
