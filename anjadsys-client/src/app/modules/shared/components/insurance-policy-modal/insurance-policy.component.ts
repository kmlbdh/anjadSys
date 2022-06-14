import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InsurancePolicyAPI } from 'src/app/modules/core/model/insurancepolicy';

@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styleUrls: ['./insurance-policy.component.scss']
})
export class InsurancePolicyComponent implements OnInit {

  currency = 'شيكل';

  modalInsurancePolicy: InsurancePolicyAPI = {} as InsurancePolicyAPI;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  printPage(): void{
    window.print()
  }

}
