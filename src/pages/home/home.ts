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
  decodeMnemomic(){
    let t = this.sApplication.vanityAddress.toggleGeneration();
    console.log(this.sApplication.vanityAddress.seed);
    console.log(this.sApplication.vanityAddress.found);
    this.sApplication.mNemonic = this.sApplication.vanityAddress.found['mnemonic'];
    console.log(this.sApplication.mNemonic);
    let seed = this.sApplication.decode_seed(this.sApplication.mNemonic);
    console.log(seed);

    this.sApplication.viewKey = seed;
    this.sApplication.address = this.sApplication.vanityAddress.found['address'];
  }
  login(){
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
  getInfoAddress(){
    this.infos = null;
    this.sApplication.addressInfo().then((result) => {
        
        console.log('la');
        console.log(result);
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
