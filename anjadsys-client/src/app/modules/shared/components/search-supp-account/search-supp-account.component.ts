import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SearchSupplierAccount } from '@models/supplier';

@Component({
  selector: 'app-search-supp-account',
  templateUrl: './search-supp-account.component.html',
  styleUrls: ['./search-supp-account.component.scss'],
  animations: [
    trigger('openClosed', [
      state('open', style({
        height: 'max-content',
        minHeight: '188px'
      })),
      state('closed', style({
        height: '0',
        minHeight: '0'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ])
    ]),
    trigger('showHideForm', [
      state('show', style({
        display: 'flex',
      })),
      state('hide', style({
        display: 'none',
      })),
      transition('show => hide', [
        animate('0.2s')
      ]),
      transition('hide => show', [
        animate('0.2s')
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchSuppAccountComponent {

  @Output() submittedSearch = new EventEmitter<SearchSupplierAccount>();

  isOpen = false;

  private currentDate = new Date();

  firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);

  accountByService: {id: number, value: string, key: string}[] = [
    {
      id: 1,
      value: 'بلاغات الحوادث',
      key: 'accident'
    },
    {
      id: 2,
      value: 'بوالص التأمين',
      key: 'policy'
    }
  ];

  searchSupplierAccountForm = this.fb.group({
    flag: [ 'policy', Validators.required ],
    startDate: [this.firstDayOfMonth.toISOString().substring(0, 10)],
    endDate: [this.lastDayOfMonth.toISOString().substring(0, 10)],
  });

  constructor(private fb: FormBuilder) { }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  formCont(controlName: string): any {
    return this.searchSupplierAccountForm.controls[controlName];
  }

  trackByServiceId(_index: number, el: any) {
    return el.id;
  }

  searchSupplierAccount = () => {
    if (this.searchSupplierAccountForm.invalid) { return; }

    let formObj = this.searchSupplierAccountForm.value;
    let keys = Object.keys(formObj);

    keys.forEach( (key: any) => {
      if (formObj[key] == null || formObj[key] === '') { delete formObj[key]; }
    });
    this.submittedSearch.emit(formObj);
  };

}
