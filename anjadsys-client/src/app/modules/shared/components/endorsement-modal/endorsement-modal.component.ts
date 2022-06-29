import { Component, OnInit } from '@angular/core';
import { EndorsementAPI } from '../../../core/model/endorsement';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-endorsement-modal',
  templateUrl: './endorsement-modal.component.html',
  styleUrls: ['./endorsement-modal.component.scss']
})
export class EndorsementModalComponent implements OnInit {

  currency = 'شيكل';

  tax = 0.16;
  taxOnCost!: number;
  totalWithTaxes!: number;

  endorsementTypeArray = ['نقل ملكية'];

  modalEndorsement: EndorsementAPI = {} as EndorsementAPI;

  constructor(public activeModal: NgbActiveModal) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.taxOnCost = Math.round(Number(this.modalEndorsement.totalPrice) * this.tax);
    // this.totalWithTaxes =  Number(this.modalEndorsement.totalPrice) + this.taxOnCost;
  }

  printPage(): void {
    window.print();
  }

}
