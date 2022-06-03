import { Component, OnInit } from '@angular/core';
import { AccidentAPI } from 'src/app/modules/core/model/accident';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accident-modal',
  templateUrl: './accident-modal.component.html',
  styleUrls: ['./accident-modal.component.scss']
})
export class AccidentModalComponent implements OnInit {

  modalAccident: AccidentAPI = {} as AccidentAPI;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  printPage(): void{
    window.print()
  }
}
