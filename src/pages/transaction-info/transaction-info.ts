import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ApplicationProvider } from '../../providers/application/application';
import { InAppBrowser } from '@ionic-native/in-app-browser';


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
    public sApplication:ApplicationProvider,
    private iab: InAppBrowser   

  ) {
    this.sApplication.openedWallet.lastTransaction = navParams.get('transaction');
    console.log(this.sApplication.openedWallet.lastTransaction);
    this.sApplication.stopTransactionRefresh();
    this.sApplication.startTransactionRefresh();
  }
  openExplorer(){
    const browser = this.iab.create('http://superior-coin.info:8081/tx/'+this.sApplication.openedWallet.lastTransaction.hash, '_blank', 'location=yes');
  }

  dismiss() {
    this.sApplication.stopTransactionRefresh();
    this.viewCtrl.dismiss();
  }
}
