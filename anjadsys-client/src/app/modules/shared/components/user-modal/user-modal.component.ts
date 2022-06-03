import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAPI } from '../../../core/model/user';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
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

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  printPage(): void{
    window.print()
  }

}
