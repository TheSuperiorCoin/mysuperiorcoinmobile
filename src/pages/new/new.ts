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
  createWallet(){
    this.sApplication.createWallet();
    this.dismiss();
  }
  importWallet(){
    this.sApplication.importWallet(this.privateKey);
  }
}
