import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {

  errorMsg: string | undefined;
  private unsubscribe$ = new Subject<void>();

  TIMEOUTMILISEC = 7000;

  loginForm = this.fb.group({
    username: [ '', [ Validators.required, Validators.minLength(6) ] ],
    password: [ '', Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cd.detach();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLogin() {
    this.cd.reattach();
    this.errorMsg = undefined;
    if (this.loginForm.invalid) {
      return this.validationMessageOnSubmit();
    }
    this.loginService.login(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data && response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data));
            const route = response.data?.role || '';
            this.router.navigate([route]);
          }
          // console.log(response);
        },
        error: err => {
          console.error(err);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });
  }

  validationMessageOnSubmit() {
    if (this.formCont('username').hasError('required') || this.formCont('password').hasError('required')) {
      this.errorMsg = 'يجب تعبئة الحقول';
    } else if (this.formCont('username').hasError('minlength')) {
      this.errorMsg = 'رقم الحساب خاطئ';
    }
  }

  formCont(controlName: string): any {
    return this.loginForm.controls[controlName];
  }

}
