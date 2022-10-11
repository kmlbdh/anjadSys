import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';
import { RegionAPI } from '@models/general';
import { SearchUser } from '@models/user';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
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
export class SearchComponent implements OnInit {

  @Input() role!: boolean;
  @Input() active!: boolean;
  @Input() regions!: RegionAPI[];
  @Output() submittedSearch = new EventEmitter<SearchUser>();

  isOpen = false;

  searchUserForm = this.fb.group({
    userID: [''],
    username: [''],
    regionID: [''],
    identityNum: [''],
  });

  rolesLang:{
    [index: string]: string;
  } = {
      'agent': 'وكيل',
      'admin': 'مدير',
      'supplier':  'مورد',
      'customer': 'زبون'
    };
  roles = Object.entries(this.rolesLang);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.role) { this.searchUserForm.addControl('role', new FormControl('')); }
  }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  searchUser(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchUser = {};

    keys.forEach(key => {
      searchConditions[key] = this.searchUserForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });

    if (searchConditions.username) { searchConditions.companyName = searchConditions.username; }
    console.log('searchConditions', searchConditions);

    this.submittedSearch.emit(searchConditions);
  }

}
