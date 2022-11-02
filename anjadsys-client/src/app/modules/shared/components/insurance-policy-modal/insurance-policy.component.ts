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

  // tax = 0.16;
  // taxOnCost!: number;
  totalWithTaxes!: number;

  conditions: Array<string> = [
    'المبلغ الاجمالي المترصد هو بناء على طلبكم وبمجرد الحفظ يجب ان يسدد لتعتبر البوليصة  سارية.',
    'شروط الوثائق في الكتيب المرفق اجباري الحصول على نسخة والاطلاع.',
    'تغطية الزجاج تشمل زجاج المركبة ولا تشمل الأضوية والمرايا وفتحة السقف.'
  ];

  modalInsurancePolicy: InsurancePolicyAPI = {} as InsurancePolicyAPI;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.totalWithTaxes =  Number(this.modalInsurancePolicy.totalPrice);
  }

  printPage(): void {
    window.print();
  }

}
