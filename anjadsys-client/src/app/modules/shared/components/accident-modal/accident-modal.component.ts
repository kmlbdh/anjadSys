import { Component, OnInit } from '@angular/core';
import { AccidentAPI } from 'src/app/modules/core/model/accident';
import { ServiceAccidentAPI } from 'src/app/modules/core/model/service';
import { UserAPI } from 'src/app/modules/core/model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accident-modal',
  templateUrl: './accident-modal.component.html',
  styleUrls: ['./accident-modal.component.scss']
})
export class AccidentModalComponent implements OnInit {

  modalAccident: {
    customer: UserAPI,
    accident: AccidentAPI,
    services: ServiceAccidentAPI[]
  } = {
    customer: {} as UserAPI,
    accident: {} as AccidentAPI,
    services: [] as ServiceAccidentAPI[]
  };

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  printPage(): void{
    window.print()
  }
}
