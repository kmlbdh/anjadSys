import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { AdminService, supplier, User } from '../admin.service';

@Component({
  selector: 'app-add-supplier-parts',
  templateUrl: './add-supplier-parts.component.html',
  styleUrls: ['./add-supplier-parts.component.scss']
})
export class AddSupplierPartsComponent implements OnInit {
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  private searchText$ = new Subject<string>();
  suppliers: any[] = [];
  selectedSupplier: supplier | undefined;

  addSupplierPartsForm = this.fb.group({
    partNo: [''],
    partName: ['', Validators.required],
    quantity: ['', Validators.required],
    cost: ['', Validators.required],
    supplierID: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
   this.searchAPI();
  }

  addSupplierParts = () => {
    let formObj = this.addSupplierPartsForm.value;
    Object.keys(formObj).forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });
    this.adminService.addSupplierParts(formObj).subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;

        this.resetForm();
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
      }
    });
    console.log(this.addSupplierPartsForm.value);
    console.log(formObj);
  }

  searchSupplier(event: Event){
    if(!(event instanceof KeyboardEvent)){
      event.preventDefault();
      event.stopPropagation();
      this.selectedSupplier = this.suppliers.filter(supplier =>
        supplier._id === this.addSupplierPartsForm.get('supplierID')?.value)[0];
      return;
    }
    const supplierName = (event.target as HTMLInputElement).value;
    if(supplierName)
      this.searchText$.next(supplierName);
  }

  searchAPI(){
    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text =>
          this.adminService.listSuppliers({nickname: text, username: text})
      )
    ).subscribe({
      next: response => {
        if(response.data)
          this.suppliers = response.data;
      },
      error: err => console.log(err)
    });
  }

  resetForm(){
    this.addSupplierPartsForm.reset();
  }

  trackById(index: number, el: any){
    return el._id;
  }
}
