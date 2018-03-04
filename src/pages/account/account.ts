import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
  }
  loading:any;
  login(w){
    this.sApplication.openedWallet = w;
    this.presentLoadingDefault('Login');
    this.sApplication.login().then((result) => { 
      if(this.sApplication.openedWallet.datas){
        this.loading.dismiss();
        this.loading = null;
      }else {
        this.dismissLoadingDefault('Refreshing Wallet');
      }
      
    }, (err) => {
      this.sApplication.openedWallet = null;
      this.loading.dismiss();
      this.loading = null;
      this.presentToast("Can't connect to server");
    });
  }
  openNewModal(){
    let modal = this.modalCtrl.create(NewPage);
    modal.present(); 
  }
  presentLoadingDefault(message) {
    if(this.loading) {
        this.loading.setContent(message);
    }else {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    } 

  }
  dismissLoadingDefault(message) {
    if(this.loading) {
        this.loading.setContent(message);
    }else {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    }
    setTimeout(() => {
      this.loading.dismiss();
      this.loading = null;
    }, 2000);
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
