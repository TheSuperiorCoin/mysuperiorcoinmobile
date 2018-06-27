import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  title:any;
  address:any;
  type:any;
  newAddress:any;
  prefix:any = "Superior:";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    public viewCtrl: ViewController,   
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
  ) {
    this.type = navParams.get('t');
    this.reload();
    this.newAddress = this.address.split(':')[1];
  }
  generatePaymentId(){
    
    this.sApplication.generatePaymentId();
    this.reload();
    this.newAddress = this.address.split(':')[1];
  }
  reloadAddress() {
    this.reload();
    this.newAddress = this.address.split(':')[1];
  }
  reload(){
    switch(this.type){
      case 'address':
        this.title = this.sApplication.openedWallet.name;
        this.address = this.prefix+this.sApplication.openedWallet.address;
      break;
      case 'addressForReceive':
        this.title = "Create a payment";
        this.address = this.prefix+this.sApplication.openedWallet.address;
        if(this.sApplication.openedWallet.trxAmount || this.sApplication.openedWallet.paymentId){
          this.address += '?';
          let arrParam:Array<any> = new Array();
          if(this.sApplication.openedWallet.trxAmount){
            arrParam.push('tx_amount='+this.sApplication.openedWallet.trxAmount);
          }
          if(this.sApplication.openedWallet.paymentId){
            arrParam.push('tx_payment_id='+this.sApplication.openedWallet.paymentId);
          }
          if(arrParam.length != 0){
            this.address += arrParam.join('&');
          }
        }
      break;
      case 'integrated':
        this.title = "Integrated Address";
        this.address = this.prefix+this.sApplication.openedWallet.integratedAddress;
      break;
    }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  copyToClipboard(){
    // remove 'Superior:' text on copy
    this.clipboard.copy(this.newAddress);
    // this.clipboard.copy(this.address);
    this.presentToast();
  }
  share(){
    this.socialSharing.share(this.address, "Received from SuperiorCoin Mobile Wallet").then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Address copied',
      duration: 2000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {});
  
    toast.present();
  }
}
