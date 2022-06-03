import { Component, OnInit } from '@angular/core';
import { OtherServiceAPI } from 'src/app/modules/core/model/otherservices';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-other-service-modal',
  templateUrl: './other-service-modal.component.html',
  styleUrls: ['./other-service-modal.component.scss']
})
export class OtherServiceModalComponent implements OnInit {

  modalOtherService: OtherServiceAPI = {} as OtherServiceAPI;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  printPage(): void{
    window.print()
  }
}
