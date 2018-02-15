import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { NewPage } from '../new/new';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


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
  ) {
  }
  login(w){
    this.sApplication.openedWallet = w;
    this.sApplication.login().then((result) => { 

    }, (err) => {
      
      console.log(err);
    });
  }
  openNewModal(){
    let modal = this.modalCtrl.create(NewPage);
    modal.present(); 
  }
 

}
