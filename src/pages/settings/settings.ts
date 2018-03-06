import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LockScreenPage } from '../lock-screen/lock-screen';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  toggleEncrypted:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sApplication: ApplicationProvider,
    public viewCtrl: ViewController,   
    public modalCtrl: ModalController
  ) {
    this.toggleEncrypted = this.sApplication.openedWallet.secured;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  updateToggleEncrypt(){
    let act:any = "enablePin";
    console.log(this.toggleEncrypted);
    if(this.toggleEncrypted == false){
      act = "disablePin";
    }
    let modal = this.modalCtrl.create(LockScreenPage, {action : act});
    modal.present(); 
  }
  
}
