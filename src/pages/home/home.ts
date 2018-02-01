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

  login(){
    this.sApplication.login().then((result) => {
        
        console.log('la');
        console.log(result);
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
