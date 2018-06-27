import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    public viewCtrl: ViewController,   
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController

  ) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  copyToClipboard(type){
    let infos:any="";
    switch(type){
      case 'address':
        let address = this.sApplication.openedWallet.address;
        infos = address.split(':')[1];
        break;
      case 'mnemonic':
        if(this.sApplication.openedWallet.secured){
          infos = this.sApplication.decryptDatas(this.sApplication.openedWallet.mnemonic, this.sApplication.decryptDatas(this.sApplication.openedWallet.pinCode, this.sApplication.secretKey));
        }else {
          infos = this.sApplication.openedWallet.mnemonic;
        }
      break;
      case 'viewKey':
      infos = this.sApplication.openedWallet.viewKey;
      break;
      case 'spendKey':
      infos = this.sApplication.openedWallet.spendKey;
      break;
    }
    this.clipboard.copy(infos);
    this.presentToast();
  }

  share(type){
    let infos:any="";
    switch(type){
      case 'address':
      infos = this.sApplication.openedWallet.address;
      break;
      case 'mnemonic':
      if(this.sApplication.openedWallet.secured){
        infos = this.sApplication.decryptDatas(this.sApplication.openedWallet.mnemonic, this.sApplication.decryptDatas(this.sApplication.openedWallet.pinCode, this.sApplication.secretKey));
      }else {
        infos = this.sApplication.openedWallet.mnemonic;
      }
      break;
      case 'viewKey':
      infos = this.sApplication.openedWallet.viewKey;
      break;
      case 'spendKey':
      infos = this.sApplication.openedWallet.spendKey;
      break;
    }
    this.socialSharing.share(infos, "Received from SuperiorCoin Mobile Wallet").then(() => {
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
  presentDeleteConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete this wallet ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.sApplication.deleteWallet();     
            this.dismiss();       
          }
        }
      ]
    });
    alert.present();
  } 
}
