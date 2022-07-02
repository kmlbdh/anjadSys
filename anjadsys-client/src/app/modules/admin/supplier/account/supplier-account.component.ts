import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { faTrashAlt, faPrint } from '@fortawesome/free-solid-svg-icons';
import { first, Subject, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { SearchSupplierAccount } from '@models/supplier';
import { SupplierAccountAPI, SupplierAccountsAPI } from '@models/account';

@Component({
  selector: 'app-supplier-account',
  templateUrl: './supplier-account.component.html',
  styleUrls: ['./supplier-account.component.scss']
})
export class SupplierAccountComponent implements OnInit, OnDestroy {

  accounts: SupplierAccountAPI[] = [];
  accountBalance = 0;
  trashIcon = faTrashAlt;
  printer = faPrint;

  private unsubscribe$ = new Subject<void>();
  selectedSupplier: string | undefined;

  currency: string = 'شيكل';
  days: string = 'يوم';

  errorMsg: string | undefined;
  successMsg: string | undefined;

  showPercentage = true;
  searchConditions: SearchSupplierAccount = { flag: 'policy' } as SearchSupplierAccount;

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  private currentDate = new Date();

  firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);

  searchSupplierAccountForm = this.fb.group({
    flag: [ 'policy', Validators.required ],
    startDate: [this.firstDayOfMonth.toISOString().substring(0, 10)],
    endDate: [this.lastDayOfMonth.toISOString().substring(0, 10)],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadSupplierAccountId();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadSupplierAccountId(): void {
    this.route.paramMap
      .pipe(first())
      .subscribe({
        next: params => {
          const supplierId = params.get('id');

          this.selectedSupplier = params.get('fullname') || undefined;
          if (!supplierId || !this.selectedSupplier) { this.router.navigate(['admin/supplier/show']); }

          this.searchConditions.supplierID = supplierId?.toUpperCase()!;
          this.listSupplierAccountAPI();
        }
      });
  }

  searchSupplierAccount = () => {
    if (this.searchSupplierAccountForm.invalid) { return; }

    let formObj = this.searchSupplierAccountForm.value;
    let keys = Object.keys(formObj);
    //  console.log('formObj 1', formObj)

    keys.forEach( (key: any) => {
      if (formObj[key] == null || formObj[key] === '') { delete formObj[key]; }
    });
    let supplierID = this.searchConditions.supplierID;
    //  console.log('formObj 2', formObj)
    //  console.log('searchConditions 1', this.searchConditions)
    this.searchConditions = { ...formObj, supplierID };
    //  console.log('searchConditions 2', this.searchConditions)
    this.listSupplierAccountAPI();
  };

  listSupplierAccountAPI = () => {
    this.listSupplierAccounts()
      .subscribe({
        next: (response: SupplierAccountsAPI) => {
          if (response.data) {
            this.accounts = response.data;
            this.pagination.total = response.total;
            this.accountBalance = this.accounts.reduce((sum, account) =>
              sum+=(Number(account.cost)! * (Number(account.supplierPercentage) || 1) || 0), 0);
            this.accountBalance = Math.round(this.accountBalance);
          }
        // console.log(response.data);
        },
        error: (err: any) => console.log(err)
      });
  };

  listSupplierAccounts = (): any => this.adminService.SuppliersAPIs.listAccount(this.searchConditions)
    .pipe(takeUntil(this.unsubscribe$));

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchSupplierAccount;
    this.p = pageNumber;
    this.listSupplierAccountAPI();
    // console.log(pageNumber);
  }

  trackById(index: number, el: any): string {
    return el._id;
  }

  printPage(): void {
    // let accounts:SupplierAccountAPI[] = [];
    this.searchConditions = { ...this.searchConditions, limit: 999999999999999, skip: undefined } as SearchSupplierAccount;
    this.listSupplierAccounts()
      .subscribe({
        next: (response: SupplierAccountsAPI) => {
          if (response.data) {
            this.accounts = response.data;
            this.pagination = { ...this.pagination, itemsPerPage: response.total };
            this.accountBalance = this.accounts
              .reduce((sum, account) =>
                sum+=(Number(account.cost)! * (Number(account.supplierPercentage) || 1) || 0), 0);
            setTimeout(() => this.printAfterLoad(), 0);
          }
        },
        error: (err: any) => console.log(err)
      });
  }
  printAfterLoad() {
    let divToPrint = document.getElementsByClassName('print')[0]!;
    let newWin = window.open('', 'Print-Window')!;
    newWin.document.open();
    newWin.document.write(`<html>
    <head>
      <style>
        body{
          direction: rtl;
          color: #000;
        }
        .card {
          border-radius: 5px;
          box-shadow: 0 1px 20px 0 rgb(69 90 100 / 8%);
          border: none;
          margin-bottom: 30px;
          background: #fff;
          padding: 1rem 1.25rem 1.25rem 1.25rem;
        }
        .page-header {
          font-size: 17px;
          color: #000;
          width: 95%;
          margin-bottom: 30px;
          text-align: right;
          font-weight: 700;
        }
        .page-header .date{
          font-weight: 200;
          display: flex;
          flex-direction: row;
          gap: 5%;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-start;
          margin-top: 8px;
        }
        .card.search-supplier-container{
          display: none;
        }
        .page-header p {
          margin: 0;
        }
        .page-content {
          width: 95%;
          min-height: 80%;
        }
        .page-content ul.responsive-table {
          margin: 0;
          padding: 0;
        }
        .page-content ul.responsive-table li {
          display: flex;
          justify-content: space-between;
        }
        .page-content ul.responsive-table li.no-data {
          width: 100%;
        }
        .page-content ul.responsive-table li.no-data > p {
          font-size: 19px;
          font-weight: 700;
          text-align: center;
          width: 100%;
        }
        .page-content ul.responsive-table .table-header {
          background-color: #0284c7;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-weight: bold;
          color: #000;
          border: 1px solid gray;
        }
        .page-content ul.responsive-table .table-row {
          background-color: #fff;
          border: 1px solid gray;
          border-top: none;
        }
        .page-content ul.responsive-table div[class*=col-custom-] {
          margin: 0 auto;
          text-align: center;
          padding: 10px;
          border-left: 1px solid gray;
        }
        .page-content ul.responsive-table div:last-child {
          border-left:none;
        }
        .page-content ul.responsive-table .col-custom-1 {
          flex-basis: 5%;
        }
        .page-content ul.responsive-table .col-custom-2 {
          flex-basis: 20%;
        }
        .page-content ul.responsive-table .col-custom-3 {
          flex-basis: 26%;
        }
        .page-content ul.responsive-table .col-custom-4 {
          flex-basis: 20%;
        }
        .page-content ul.responsive-table .col-custom-5 {
          flex-basis: 29%;
          text-align: center;
        }
        .page-content ul.responsive-table .col-custom-total-label{
          flex-basis: 26%;
          font-weight: 700;
        }
        .page-content ul.responsive-table .col-custom-total{
          flex-basis: 74%;
          font-weight: 700;
        }
        .page-content ul.responsive-table .col-custom-5.control {
          display: none;
        }
        .page-content ul.responsive-table .col-custom-5.control button {
          display: none;
        }
        .page-content ul.responsive-table .col-custom-5.control button fa-icon {
          display: none;
        }
        .page-content ul.responsive-table .col-custom-5.control button.btn-error {
          display: none;
        }
        .page-content ul.responsive-table .col-custom-5.control button.btn-primary {
        display: none;
        }
        .d-print-none{
          display: none;
        }
      </style>
    </head>
    <body onload="window.print()">
    ${ divToPrint.innerHTML }
    </body></html>`);
    const node = document.createElement('div');
    node.setAttribute('class', 'date');

    const childNode1 = document.createElement('span');
    const childNode2 = document.createElement('span');
    const textnode1 = document.createTextNode(`من : ${ this.formCont('startDate').value }`);
    const textnode2 = document.createTextNode(`الى : ${ this.formCont('endDate').value }`);
    childNode1.appendChild(textnode1);
    childNode2.appendChild(textnode2);
    node.appendChild(childNode1);
    node.appendChild(childNode2);
    newWin.document.querySelector('.page-header')?.appendChild(node);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
    setTimeout(() => this.reloadPageAfterPrint(), 0);
  }

  reloadPageAfterPrint() {
    this.searchConditions = { ...this.searchConditions, skip: undefined, limit: undefined } as SearchSupplierAccount;
    this.pagination = { ...this.pagination, itemsPerPage: 10 };
    this.listSupplierAccountAPI();
  }

  formCont(controlName: string): any {
    return this.searchSupplierAccountForm.controls[controlName];
  }

}
