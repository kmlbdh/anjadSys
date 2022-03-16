import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { combineLatest, first, Observable, Subject, takeUntil } from 'rxjs';
import { RegionAPI } from 'src/app/modules/core/model/general';
import { updateUser, UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { ConfirmedValidator } from '../confirm.validator';
import { AgentService } from '../../agent.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined;
  successMsg: string | undefined;
  removePassword: boolean = true;
  removeIdentityNum: boolean = true;
  removeCompanyName: boolean = true;
  private unsubscribe$ = new Subject<void>();
  user!: UserAPI;
  // rolesAPI!: RoleAPI[];
  regionsAPI!: RegionAPI[];

  private keys = ['backspace', 'arrowleft', 'arrowright'];
  roles:{
    [index: string]: string;
  } = {
    'agent': 'وكيل',
    'admin': 'مدير',
    'supplier':  'مورد',
    'customer': 'زبون'
  };

  TIMEOUTMILISEC = 7000;

  editUserForm = this.fb.group({
    identityNum: ['', [Validators.required,Validators.minLength(9), Validators.pattern('[0-9]*')]],
    username: ['', Validators.required],
    password: [''],
    confirmPassword: [''],
    tel: [''],
    fax: [''],
    jawwal1: ['', Validators.required],
    jawwal2: [''],
    note: [''],
    address: [''],
    email: [''],
    regionId: ['', Validators.required],
  }, {validators: ConfirmedValidator('password', 'confirmPassword')});

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPageData();
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  getPageData(){
    this.route.paramMap.subscribe({
      next: params => {
        const userID = params.get('id');
        console.log("userID", userID);
        if(!userID)
          this.router.navigate(['/admin/user/show']);
          this.getData(userID!);
      }
    });
  }

  getData(userID: string){
    let user$ = this.agentService.showUsers({userID: userID!}) as Observable<UsersAPI>;
    let regions$ = this.agentService.listRegions() as Observable<any>;

    combineLatest([user$, regions$])
    .pipe(first())
    .subscribe( ([user, regions]: [UsersAPI, any]) => {
        if(regions.data){
          this.regionsAPI = regions.data;
        }
        if(user.data && user.data.length === 1)
          this.user = user.data[0];

        this.buildForm();
      });
  }

  updateUser = (): void => {
    let formObj: updateUser = {} as updateUser;
    formObj.id = this.user.id;

    let controlsObject = this.editUserForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.user[val])
            formObj[val] = currValue;
      }
    });

    if(Object.keys(formObj).length < 2){
      this.errorMsg = "يجب اجراء تغيير في المعلومات حتى يتم تحديثها!";
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.agentService.updateUser(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if(response.data)
            this.successMsg = response.message;
            // this.user = response.data;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

          // this.buildForm();
          console.log(response);
        },
        error: (err) => {
          console.error(err.error);
          if(err?.error?.message){
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
    });

    console.log(formObj);
  }

  buildForm():void{
    this.editUserForm.setValue({
      identityNum: this.user.identityNum,
      username: this.user.username,
      password: '',
      confirmPassword: '',
      tel: this.user.tel || '',
      fax: this.user.fax || '',
      jawwal1: this.user.jawwal1,
      jawwal2: this.user.jawwal2 || '',
      note: this.user.note || '',
      email: this.user.email || '',
      address: this.user.address || '',
      regionId: this.user.Region.id,
    });
  }


  formCont(controlName: string): AbstractControl{
    return this.editUserForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean{
    if(event instanceof KeyboardEvent){
      const code = event.key;
      console.log(code);
      if(Number.isNaN(+code))
        if(!this.keys.includes(code.toLowerCase()))
          return false;
    }
    return true;
  }
}
