import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ApplicationProvider } from '../../providers/application/application';


@Component({
  selector: 'page-transaction-info',
  templateUrl: 'transaction-info.html',
})
export class TransactionInfoPage {
  transaction:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public sApplication:ApplicationProvider   

  ) {
    this.sApplication.openedWallet.lastTransaction = navParams.get('transaction');
    this.sApplication.stopTransactionRefresh();
    this.sApplication.startTransactionRefresh();
  }


  dismiss() {
    this.sApplication.stopTransactionRefresh();
    this.viewCtrl.dismiss();
  }
}
