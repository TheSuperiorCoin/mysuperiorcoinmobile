import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { CnutilProvider } from '../../providers/cnutil/cnutil';
import { QrcodePage } from '../qrcode/qrcode';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})
export class ReceivePage {
  address:any;
  paymentId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    public Cnutil:CnutilProvider,
    public modalCtrl: ModalController,

  ) {
    if(this.sApplication.openedWallet){
      this.address = this.sApplication.openedWallet.address;
      this.sApplication.generatePaymentId();
    }
    
  }
  
  generatePaymentId(){
    
    this.sApplication.generatePaymentId();
  }
  openQrcodeModal(type) { 
    let modal = this.modalCtrl.create(QrcodePage, {t : type});
    modal.present(); 
      
  }
  copyToClipboard(type){
    let infos:any;
    switch(type){
      case 'address':
      infos = this.sApplication.openedWallet.address;
      break;
      case 'integrated':
      infos = this.sApplication.openedWallet.integratedAddress;
      break;
    }
    this.clipboard.copy(infos);
    this.presentToast();
  }
  share(type){
    let infos:any;
    switch(type){
      case 'address':
      infos = this.sApplication.openedWallet.address;
      break;
      case 'integrated':
      infos = this.sApplication.openedWallet.integratedAddress;
      break;
    }
    this.socialSharing.share(infos, "Receive from SuperioCoin Mobile Wallet").then(() => {
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
