import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined;
  private unsubscribe$ = new Subject<void>();

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onLogin() {
    this.loginService.login(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response.data));
          const route = response.data?.role || '';
          this.router.navigate([route]);
          console.log(response);
        },
        error: (err) => {
          console.error(err);
          if(err?.error?.message)
            this.errorMsg = err.error.message;
        }
      });
  }
}
