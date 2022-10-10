import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  faUsers,
  faUserTie,
  faTaxi,
  faCarCrash,
  faCarSide,
  faFileInvoiceDollar,
  faTruckMoving,
  faWrench,
  faClipboardList,
  faFileMedicalAlt,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { NavInput } from '@shared/components/nav/nav.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

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
  constructor() { }

}
