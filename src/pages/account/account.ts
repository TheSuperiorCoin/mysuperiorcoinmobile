import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider
  ) {
  }
  login(w){
    this.sApplication.openedWallet = w;
    this.sApplication.login().then((result) => { 

    }, (err) => {
      
      console.log(err);
    });
  }
  createWallet(){
    this.sApplication.createWallet();
  }

}
