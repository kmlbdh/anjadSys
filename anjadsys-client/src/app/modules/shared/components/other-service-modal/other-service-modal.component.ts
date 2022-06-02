import { Component, OnInit } from '@angular/core';
import { InsurancePolicyAPI } from 'src/app/modules/core/model/insurancepolicy';
import { OtherServiceAPI } from 'src/app/modules/core/model/otherservices';
import { UserAPI } from 'src/app/modules/core/model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-other-service-modal',
  templateUrl: './other-service-modal.component.html',
  styleUrls: ['./other-service-modal.component.scss']
})
export class OtherServiceModalComponent implements OnInit {

  modalOtherService: {
    customer: UserAPI,
    insurancePolicy: InsurancePolicyAPI,
    otherService: OtherServiceAPI
  } = {
    customer: {} as UserAPI,
    insurancePolicy: {} as InsurancePolicyAPI,
    otherService: {} as OtherServiceAPI
  };

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  printPage(): void{
    window.print()
  }
}
