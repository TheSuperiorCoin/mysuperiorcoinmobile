import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
})
export class ReceivePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController
  ) {
  }
  copyToClipboard(){
    this.clipboard.copy(this.sApplication.openedWallet.address);
    this.presentToast();
  }
  share(){
    this.socialSharing.share(this.sApplication.openedWallet.address, "Receive from SuperioCoin Mobile Wallet").then(() => {
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
