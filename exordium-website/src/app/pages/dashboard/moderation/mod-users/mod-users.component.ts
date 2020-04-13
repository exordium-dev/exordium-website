import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ModerationService } from 'src/app/service/moderation.service';
import { Account } from 'src/app/service/shared/account';

@Component({
  selector: 'app-mod-users',
  templateUrl: './mod-users.component.html',
  styleUrls: ['./mod-users.component.scss']
})
export class ModUsersComponent implements OnInit {
  public currentUser = new Account();
  users: any[];

  constructor(
    public router: Router,
    private authService: AuthService,
    private moderationService: ModerationService
  ) { }

  ngOnInit(): void {
    this.authService.getUserData().subscribe(res => {
      this.currentUser = res.response;

      this.checkPermissions();
    })
  }

  checkAccessPage (array, key, value) {
    return array.some(object => object[key] === value);
  }

  checkPermissions() {
    if (this.checkAccessPage(this.currentUser.access.pages, 'page', 'users')) {
      this.moderationService.getUsers().subscribe(res => {
        this.users = res;
        console.log(this.users);
      })
    } else {
      this.router.navigate(['dashboard']);
    }
  }

}