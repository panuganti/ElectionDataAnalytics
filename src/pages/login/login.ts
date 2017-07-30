import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  error: string;
  showSpinnie: boolean = false;
  showError: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
  }

  async login() {
    try {
      this.showSpinnie = true;
      let loggedInUser = await this.afAuth.auth.signInWithEmailAndPassword(this.email.trim(), this.password.trim())
      this.showSpinnie = false;
      window.localStorage.setItem('email', loggedInUser.email);
      this.navCtrl.setRoot('HomePage');
    }
    catch (err) {
      this.showSpinnie = false;
      this.handleAuthError(err);
    }
  }

  handleAuthError(err: any) {
    this.password = '';
    if (err.code == 'auth/network-request-failed') {
      this.error = "Unable to connect to server. Try again after some time";
    }
    else if (err.code == 'auth/user-not-found') {
      this.error = "No such  user with the email provided";
    }
    else if (err.code == 'invalid-email') {
      this.error = "Invalid Email";
    }
    else if (err.code == 'auth/wrong-password') {
      this.error = "Wrong Password";
    }
    else {
      this.error = err.message;
    }
    this.showError = true;
  }

}
