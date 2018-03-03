import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';


@Component({
  selector: 'page-import',
  templateUrl: 'import.html',
})
export class ImportPage {
  no_blocks:any = 1000;

  constructor(
    public navCtrl: NavController,  
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    public viewCtrl: ViewController,   

  ) {
  }

  refreshWallet(){
    this.sApplication.events.publish('refresh:wallettrx', this.no_blocks);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
