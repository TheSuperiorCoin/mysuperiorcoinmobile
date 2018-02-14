import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage { 
  infos:any;

  constructor(
    public navCtrl: NavController,
    private sApplication: ApplicationProvider
  
  ) {
    
  }

  createWallet(){
    this.sApplication.createWallet();
  }
  decodeMnemomic(){
    let t = this.sApplication.vanityAddress.toggleGeneration();
    this.sApplication.mNemonic = this.sApplication.vanityAddress.found['mnemonic'];
    this.sApplication.address = this.sApplication.vanityAddress.found['address'];
    let seed = this.sApplication.decode_seed(this.sApplication.mNemonic);
    console.log(this.sApplication.mNemonic);
    console.log(this.sApplication.address);
    console.log(this.sApplication.keys);
    console.log(seed);

    this.sApplication.viewKey = this.sApplication.keys.view.sec;
    
  }
  login(w){
    this.sApplication.openedWallet = w;
    this.sApplication.login().then((result) => { 
        
      /*let datas:any = result;
      if(datas.status == false){
        this.loading.dismiss();
        this.presentToast('Erreur');
        this.nav.setRoot('LoginPage');
        //this.splashScreen.hide();
      }else {         
        this.auth.preload().then((result) => {
          
          this.loading.dismiss();
          let datas:any = result;
          if(datas.status == false){
            this.presentToast('Erreur');
            this.nav.setRoot('LoginPage');
            //this.splashScreen.hide();
          }else {         
              this.storage.set('toklio_credentials', this.auth.registerCredentials);
              this.nav.setRoot(TabsPage);
              this.nav.popToRoot();
          }
  
        }, (err) => {
          this.loading.dismiss();
          this.presentToast(err);
        });
      }*/

    }, (err) => {
      /*this.loading.dismiss();
      this.presentToast(err.message);*/
      console.log(err);
    });
  }
  getInfoAddress(w){
    this.infos = null;
    
    this.sApplication.addressInfo().then((result) => {
        
       
        this.sApplication.openedWallet.datas = result;
        this.infos = result;
        
      /*let datas:any = result;
      if(datas.status == false){
        this.loading.dismiss();
        this.presentToast('Erreur');
        this.nav.setRoot('LoginPage');
        //this.splashScreen.hide();
      }else {         
        this.auth.preload().then((result) => {
          
          this.loading.dismiss();
          let datas:any = result;
          if(datas.status == false){
            this.presentToast('Erreur');
            this.nav.setRoot('LoginPage');
            //this.splashScreen.hide();
          }else {         
              this.storage.set('toklio_credentials', this.auth.registerCredentials);
              this.nav.setRoot(TabsPage);
              this.nav.popToRoot();
          }
  
        }, (err) => {
          this.loading.dismiss();
          this.presentToast(err);
        });
      }*/

    }, (err) => {
      /*this.loading.dismiss();
      this.presentToast(err.message);*/
      console.log(err);
    });
  }
}
