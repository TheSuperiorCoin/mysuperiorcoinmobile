import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-lock-screen',
  templateUrl: 'lock-screen.html',
})
export class LockScreenPage {
  pinCode:any = new Array();
  pinCodeSecond:any;
  title:any = "Unlock your wallet";
  enable:any;
  action:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sApplication: ApplicationProvider,
    public viewCtrl: ViewController,
  ) {
    this.action = navParams.get('action');
    this.pinCodeSecond = null;
    this.pinCode = new Array();
    this.initLockScreen();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  deletePrevious(){
    this.pinCode.pop();
  }
  initLockScreen(){
    
    if(this.sApplication.openedWallet.secured){
      if(this.action == "disablePin"){
        this.title = "Disable PIN code";
      }else {
        this.title = "Unlock your wallet";
      }
      this.enable = true;
    }else {
      if(this.pinCodeSecond){
        this.title = "Confirm PIN code";
      }else {
        this.title = "Encrypt your wallet";
      }
      this.enable = false;
    }
  }
  setPinNumber(num){
    if(this.pinCode == null){
      this.pinCode = new Array();
    }
    this.pinCode.push(num);
    if(this.pinCode.length == 6){
      if(this.enable){
        if(this.action == "disablePin"){
          this.disablePin();
        }else {
          this.unlockWallet();
        }
       
      }else {
        this.confirmPinCode();
      }
    }
  }
  
  confirmPinCode(){
    if(this.pinCodeSecond){
      let ok:boolean = true;
      for(var i=0;i<6;i++){
        if(this.pinCode[i] != this.pinCodeSecond[i]){
          ok = false;
        }
      }
      if(ok){
        this.encryptWallet();
      }else {
        this.cancel();
      }
    }else {
      this.pinCodeSecond = this.pinCode;
      this.pinCode = new Array();
      this.initLockScreen();
    }
  }
  unlockWallet(){
    this.dismiss();
    let access:any = this.sApplication.checkPinCode(this.pinCode);

    this.sApplication.events.publish('wallet:unlock', access);
  }
  encryptWallet(){
    this.sApplication.encryptWallet(this.pinCode.join(''));
    this.dismiss();
  }
  disablePin(){
    let access:any = this.sApplication.checkPinCode(this.pinCode);
    if(access){
      this.sApplication.disablePinCode();
      this.dismiss();
    }else {
      this.cancel();
    }
    
  }
  cancel(){
    switch(this.action){
      case "unlockWallet":
      this.sApplication.openedWallet = null;
      break;
    }
    this.sApplication.events.unsubscribe('wallet:unlock');
    this.dismiss();
  }
}
