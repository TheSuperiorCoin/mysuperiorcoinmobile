import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AccountDetailsPage } from '../account-details/account-details';
import { QrcodePage } from '../qrcode/qrcode';
import { ImportPage } from '../import/import';
import { SettingsPage } from '../settings/settings';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage { 
  infos:any;

  constructor(
    public navCtrl: NavController,
    private sApplication: ApplicationProvider,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loading : LoadingController
  ) {

    // temporary workaround
    // to avoid blank screen during interval
    this.sApplication.events.subscribe('loader',(loading) => {
      loading.loading.setContent('Fetching wallet information...');
      this.sApplication.events.unsubscribe('loader');
      let sub = setInterval(() => {
        if(this.sApplication.openedWallet.datas){
          loading.loading.dismiss();
          clearInterval(sub)
        }
      },100)
    });

  }

  copyToClipboard(){
    this.clipboard.copy(this.sApplication.openedWallet.address);
    this.presentToast();
  }
  share(){
    this.socialSharing.share(this.sApplication.openedWallet.address, "Received from SuperiorCoin Mobile Wallet").then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  openSettings() { 
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present(); 
  }
  openQrcodeModal(type) { 
    let modal = this.modalCtrl.create(QrcodePage, {t : type});
    modal.present(); 
      
  }
  openTransactions() { 
    let modal = this.modalCtrl.create(ImportPage);
    modal.present(); 
      
  }
  openFormDetail() { 
    let modal = this.modalCtrl.create(AccountDetailsPage);
    modal.present(); 
      
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
