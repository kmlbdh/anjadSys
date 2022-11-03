import { Component } from '@angular/core';
import { EndorsementAPI } from '../../../core/model/endorsement';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-endorsement-modal',
  templateUrl: './endorsement-modal.component.html',
  styleUrls: ['./endorsement-modal.component.scss']
})
export class EndorsementModalComponent {

  currency = 'شيكل';
  endorsementTypeArray = ['نقل ملكية'];
  modalEndorsement: EndorsementAPI = {} as EndorsementAPI;

  constructor(public activeModal: NgbActiveModal) { }

  printPage(): void {
    window.print();
  }

}
