import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAPI } from '../../../core/model/user';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {

  customerDetails: UserAPI = {} as UserAPI;
  rolesLang:{
    [index: string]: string;
  } = {
      'agent': 'وكيل',
      'admin': 'مدير',
      'supplier':  'مورد',
      'customer': 'زبون'
    };

  blocked:{
    [index: string]: string;
  } = {
      false: 'مفعل',
      true: 'معطل',
    };

  servicesPackageArray = [ 'الضفة الغربية', 'القدس' ];

  constructor(public activeModal: NgbActiveModal) { }

  printPage(): void {
    window.print();
  }

}
