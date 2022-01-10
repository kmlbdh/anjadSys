import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, AdminService } from './admin.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  faBars = faBars;
  user!: User;
  constructor(private adminService: AdminService, private router: Router) {
  }

  ngOnInit(): void {
    const localStorageUser: string = localStorage.getItem('user') || '';
    if(!localStorageUser)
      this.router.navigate(['']);

    this.user = JSON.parse(localStorageUser);
    if(!this.user.accessToken)
      this.router.navigate(['']);
  }

  profilePop(){

  }

  verifyLoggedInAdmin(user: User){
    this.adminService.verifyLoggedInAdmin(user.accessToken).subscribe({
      next: (res) =>{
        if(!res.data || res?.data?._id !== user.id)
          this.router.navigate(['login']);
      },
      error: err => this.router.navigate(['login'])
    })
  }

}
