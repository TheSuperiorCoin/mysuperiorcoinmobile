import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@Component({
  selector: 'page-lock-screen',
  templateUrl: 'lock-screen.html',
})
export class LockScreenPage {
  pinCode:any;
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
    this.pinCode = null;
    this.pinCodeSecond = null;
    this.initLockScreen();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  initLockScreen(){
    
    if(this.sApplication.openedWallet.secured){
      console.log(this.action);
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
    console.log(this.pinCode);
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
    console.log('confirmPinCode :'+this.pinCodeSecond+' -- '+this.pinCode);
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
      this.pinCode = null;
      this.initLockScreen();
    }
  }
  unlockWallet(){
    console.log('unlockWallet');
    this.dismiss();
    let access:any = this.sApplication.openedWallet.checkPinCode(this.pinCode);

    this.sApplication.events.publish('wallet:unlock', access);
  }
  encryptWallet(){
    console.log('encryptWallet');
    this.sApplication.encryptWallet(this.pinCode.join(''));
    this.dismiss();
  }
  disablePin(){
    console.log('disablePin');
    let access:any = this.sApplication.openedWallet.checkPinCode(this.pinCode);
    if(access){
      this.sApplication.disablePinCode();
      this.dismiss();
    }else {
      this.cancel();
    }
    
  }
  cancel(){
    this.sApplication.events.unsubscribe('wallet:unlock');
    this.dismiss();
  }
}
