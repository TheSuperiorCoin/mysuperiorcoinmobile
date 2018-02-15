import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { NewPage } from '../new/new';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
  }
  login(w){
    this.sApplication.openedWallet = w;
    this.sApplication.login().then((result) => { 

    }, (err) => {
      this.sApplication.openedWallet = null;
      this.presentToast("Daemon is not runing");
    });
  }
  openNewModal(){
    let modal = this.modalCtrl.create(NewPage);
    modal.present(); 
  }
 
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {});
  
    toast.present();
  }
}
