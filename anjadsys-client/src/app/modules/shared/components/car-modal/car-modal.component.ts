import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarAPI } from 'src/app/modules/core/model/car';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss']
})
export class CarModalComponent {

  carDetails: CarAPI = {} as CarAPI;
  constructor(public activeModal: NgbActiveModal) { }

  printPage(): void {
    window.print();
  }

}
