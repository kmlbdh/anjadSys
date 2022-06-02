import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InsurancePolicyAPI } from 'src/app/modules/core/model/insurancepolicy';
import { ServicePolicyAPI } from 'src/app/modules/core/model/service';
import { UserAPI } from 'src/app/modules/core/model/user';

@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styleUrls: ['./insurance-policy.component.scss']
})
export class InsurancePolicyComponent implements OnInit {

  currency = 'شيكل';

  modalInsurancePolicy: {
    customer: UserAPI,
    insurancePolicy: InsurancePolicyAPI,
    services: ServicePolicyAPI[]
  } = {
    customer: {} as UserAPI,
    insurancePolicy: {} as InsurancePolicyAPI,
    services: [] as ServicePolicyAPI[]
  };

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  printPage(): void{
    window.print()
  }

}
