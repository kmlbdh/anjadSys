import { Component } from '@angular/core';
import {
  faCarCrash,
  faCarSide,
  faFileInvoiceDollar,
  faTaxi,
  faUsers,
  faWrench,
  faFileMedicalAlt,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { NavInput } from '@shared/components/nav/nav.component';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent {

  miniNavBar = false;
  state: 'small' | 'large' = 'large';

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
          shortName: 'اظهار',
          link: 'user/show'
        },
        {
          id: 2,
          name: 'اضافة زبون',
          shortName: 'اضافة',
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
          name: 'اظهار الكل',
          shortName: 'اظهار',
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
      id: 5,
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
          id: 3,
          name: 'اظهار كل الموديلات',
          shortName: 'الموديلات',
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
      id: 7,
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
      id: 8,
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
      id: 9,
      name: 'المالية',
      faIcon: faFileInvoiceDollar,
      hide: true,
      children: [
        {
          id: 1,
          name: 'اظهار الحساب المالي ',
          shortName: 'اظهار',
          link: 'account/show'
        }
      ]
    },
  ];

  constructor() { }

}
