import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AccountDetailsPage } from '../account-details/account-details';


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
    private alertCtrl: AlertController
  
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
          }
        }
      ]
    });
    alert.present();
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Actions',
      buttons: [
        {
          text: 'Wallet informations',
          handler: () => {
            this.openFormDetail();
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.presentDeleteConfirm();
          }
        },
        
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
 
    actionSheet.present();
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
