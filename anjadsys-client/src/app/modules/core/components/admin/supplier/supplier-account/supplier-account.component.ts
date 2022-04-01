import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { first, Subject, takeUntil } from 'rxjs';
import { partAPI } from '../../../../model/supplierparts';

@Component({
  selector: 'app-supplier-account',
  templateUrl: './supplier-account.component.html',
  styleUrls: ['./supplier-account.component.scss']
})
export class SupplierAccountComponent implements OnInit, OnDestroy {
  accounts: any[] = [];

  private unsubscribe$ = new Subject<void>();
  trashIcon = faTrashAlt;
  selectedSupplier: string | undefined;
  currency: string = "شيكل";
  days: string = "يوم";
  errorMsg: string | undefined;
  successMsg: string | undefined;
  showPercentage = true;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadSupplierPartsById();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadSupplierPartsById(): void{
    this.route.paramMap
    .pipe(first())
    .subscribe({
      next: params => {
        const supplierId = params.get('id');

        this.selectedSupplier = params.get('fullname') || undefined;
        console.log(this.selectedSupplier);
        if(!supplierId || !this.selectedSupplier) this.router.navigate(['admin/supplier/show']);

        this.adminService.listSupplierAccount({supplierID: supplierId?.toUpperCase()!})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: response => {
            if(response.data)
              this.accounts = response.data;
            console.log(response.data);
          },
          error: err => console.log(err)
        })
      }
    });
  }

  deletePart(part: partAPI): void{
    const yes = confirm(`هل تريد حذف القطعة "${part.partNo || ''} | ${part.partName}"  للمورد؟`);
    if(!yes) return;

    this.adminService.deleteSupplierPart(part._id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.loadSupplierPartsById();
        }
        console.log(response.data);
      },
      error: err => console.log(err)
    })
  }

  trackById(index: number, el: any): string{
    return el._id;
  }

  printPage(): void{
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
          border-radius: 3px;
          padding: 15px 15px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
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
        }
        .page-content ul.responsive-table .table-row {
          background-color: #fff;
        }
        .page-content ul.responsive-table div[class*=col-custom-] {
          margin: auto;
          text-align: center;
        }
        .page-content ul.responsive-table .col-custom-1 {
          flex-basis: 7%;
        }
        .page-content ul.responsive-table .col-custom-2 {
          flex-basis: 20%;
        }
        .page-content ul.responsive-table .col-custom-3 {
          flex-basis: 23%;
        }
        .page-content ul.responsive-table .col-custom-4 {
          flex-basis: 20%;
        }
        .page-content ul.responsive-table .col-custom-5 {
          flex-basis: 30%;
          text-align: center;
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
    ${divToPrint.innerHTML}
    </body></html>`);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();

    // window.print()
  }
}
