import { Component } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user?: User | null;
  title = 'employee-app';
  
  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(data => this.user = data);
  }

  logout() {
    this.accountService.logout();
  }
}
