import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMsg: String | undefined;

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit(): void {}
  onLogin = () => {
    this.loginService.login(this.loginForm.value)
    .pipe(take(1))
    .subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        const route = response.data?.role || '';
        this.router.navigate([route]);
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
      }
    });
  }
}
