import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = 'rmatej545@gmail.com';
  linkSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe((user) => {
      console.log(user)
      if (user) {
        this.router.navigateByUrl('/workspace', { replaceUrl: true });
      }
    });
  }

  ngOnInit(): void {}

  async signIn() {
    this.ngxSpinnerService.show();

    const result = await this.authService.signInWithEmail(this.email);

    this.ngxSpinnerService.hide();

    if (!result.error) {
      this.linkSuccess = false;
    } else {
      alert(result.error.message);
    }
  }
}
