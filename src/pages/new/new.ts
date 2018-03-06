import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-new',
  templateUrl: 'new.html',
})
export class NewPage {
  privateKey:any;
  walletName:any;
  password:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication: ApplicationProvider,
    public viewCtrl: ViewController
  ) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  valid(){
    /*if(this.walletName != "" && this.password != ""){
      return false;
    }*/
    return true;
  }
  createWallet(){
    this.sApplication.createWallet(this.walletName);
    this.dismiss();
  }
  importWallet(){
    this.sApplication.importWallet(this.walletName, this.privateKey);
    this.dismiss();
  }
}
