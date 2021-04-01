import {Component, OnInit} from '@angular/core';
import {OktaAuthService} from "@okta/okta-angular";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean;
  userFullName: string;
  storage:Storage=sessionStorage;


  constructor(private oktaAuthService: OktaAuthService) {
  }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
      }
    );
  }

  logout() {
    this.oktaAuthService.signOut();
  }

}
