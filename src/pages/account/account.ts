import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { NewPage } from '../new/new';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LockScreenPage } from '../lock-screen/lock-screen';


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
    if(this.sApplication.openedWallet.secured){
      this.openLockScreenModal();
    }else {
      this.loginToWallet();
    }
    
  }
  loginToWallet(){
    this.sApplication.events.unsubscribe('wallet:unlock');
    this.presentLoadingDefault('Login');
    this.sApplication.login().then((result) => { 
      if(this.sApplication.openedWallet.datas){
        this.loading.dismiss();
        this.loading = null;
      }
      else {
        this.dismissLoadingDefault('Refreshing Wallet');
      }
      
    }, (err) => {
      this.sApplication.openedWallet = null;
      this.loading.dismiss();
      this.loading = null;
      this.presentToast("Can't connect to server");
    });
  }
  logout(){
    this.sApplication.events.unsubscribe('wallet:unlock');
    this.sApplication.openedWallet = null;
    if(this.loading)this.loading.dismiss();
    this.loading = null;
    this.presentToast("Can't access to wallet");
  }
  openNewModal(){
    let modal = this.modalCtrl.create(NewPage);
    modal.present(); 
  }
  openLockScreenModal(){
    this.sApplication.events.subscribe('wallet:unlock', (access) => {
      if(access){
        this.loginToWallet();
      }else {
        this.logout();
      }
    });
    let modal = this.modalCtrl.create(LockScreenPage, {action: 'unlockWallet'});
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
  
    
    // temporary workaround
    this.sApplication.events.publish('loader',{loading : this.loading})
    
    // if(this.loading) {
    //     this.loading.setContent(message);
    // }else {
    //     this.loading = this.loadingCtrl.create({
    //         content: message
    //     });
    //     this.loading.present();
    // }
    // setTimeout(() => {
    //   this.loading.dismiss();
    //   this.loading = null;
    // }, 2000);
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
