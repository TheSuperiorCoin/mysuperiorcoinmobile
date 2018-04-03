import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Events } from 'ionic-angular/util/events';
import { SendCoinProvider } from '../../providers/send-coin/send-coin';
import { CnutilProvider } from '../../providers/cnutil/cnutil';
import { ConfigProvider } from '../../providers/config/config';


@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {
  receiverAddress:any = "";
  paymentId:any = "";
  amountToSend:any = "";


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    public sSendCoin:SendCoinProvider,
    public sCnutil:CnutilProvider,
    public sConfig:ConfigProvider
  ) {
  }

  ionViewDidLoad() {
  }
  generatePaymentId(){
    this.paymentId =  this.sCnutil.rand_8();
  }
  generateTransaction(){
    let targets = [{
      address:this.receiverAddress,
      amount:this.amountToSend*100000000
    }]
    this.sSendCoin.sendCoins(targets, parseInt(this.sConfig.defaultMixin), this.paymentId);
  }
  scanCodePayment(){
    this.barcodeScanner.scan().then((barcodeData) => {
      
      if (barcodeData.cancelled) {
        return false;
      }
      let address:any;
      let str:any = barcodeData.text;
      this.paymentId = str;
      
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  scanCode(){
    this.barcodeScanner.scan().then((barcodeData) => {
      
      if (barcodeData.cancelled) {
        return false;
      }
      let address:any;
      let str:any = barcodeData.text;
      str = str.split(':');
      if(str[0] == "Superior"){
        str = str[1];
      }else {
        str = str[0];
      }
      str = str.split('?');
      this.receiverAddress = str[0];
      if(str.length > 1){
        let tmp:any = str[1].split('&');
        for(var i in tmp){
          let tt:any = tmp[i].split('=');
          switch(tt[0]){
            case 'tx_amount':
              this.amountToSend = tt[1];
            break;
            case 'tx_payment_id':
              this.paymentId = tt[1];
            break;
          }
        }
      }
      
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  validForm(){
    return true;
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
