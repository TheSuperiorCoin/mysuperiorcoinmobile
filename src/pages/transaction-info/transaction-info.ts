import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-transaction-info',
  templateUrl: 'transaction-info.html',
})
export class TransactionInfoPage {
  transaction:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController   

  ) {
    this.transaction = navParams.get('transaction');
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
