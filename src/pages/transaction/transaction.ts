import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { TransactionInfoPage } from '../transaction-info/transaction-info';


@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    public modalCtrl: ModalController

  ) {
  }

  openModalTrx(trx) {
    let modal = this.modalCtrl.create(TransactionInfoPage, {transaction : trx});
    modal.present(); 
  }

}
