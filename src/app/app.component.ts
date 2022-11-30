import { Component } from '@angular/core';
import { Router,NavigationStart} from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import * as $ from 'jquery'

import { AuthService } from './services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ErrorStateMatcher } from '@angular/material/core';
import { I } from '@angular/cdk/keycodes';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'KAFED AGRO';
  isSignedIn = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  constructor(public firebaseService : AuthService ,private AngularFirestore: AngularFirestore,private db: AngularFirestore,private router: Router){

  }

  ngOnInit(){
    if(localStorage.getItem('user') != null){
      this.isSignedIn = true
    }
    else{
      this.isSignedIn = false
    }
  }


  async onSignin(email:string,password:string){

    

    await this.firebaseService.signin(email,password)
    if(this.firebaseService.isLoggedIn)
    this.isSignedIn = true

    
    // db: AngularFireStore
  }

  async handleLogout(){
    await this.firebaseService.logout()
    if(!this.firebaseService.isLoggedIn)
    this.isSignedIn = false
  }
  

  changePage(data: any) {
    this.router.navigate(['/', data]);

    $('.stock').removeClass('active');
    $('.client').removeClass('active');
    $('.commande').removeClass('active');
    $('.analyse').removeClass('active');
    $('.approvisionnement').removeClass('active');
    $('.deconnexion').removeClass('active');

    $('.'+data).addClass('active');
  }

  changePage2(data: any, params: any) {
    //this.router.navigate([data + '/' + params]);
    this.router.navigate(['/'+data+'/'+params]);

    $('.stock').removeClass('active');
    $('.client').removeClass('active');
    $('.commande').removeClass('active');
    $('.analyse').removeClass('active');
    $('.approvisionnement').removeClass('active');
    $('.deconnexion').removeClass('active');

    $('.'+data).addClass('active');
  }

}
