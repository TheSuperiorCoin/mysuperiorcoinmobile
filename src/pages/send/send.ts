import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApplicationProvider } from '../../providers/application/application';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {
  receiverAddress:any;
  paymentId:any;
  amountToSend:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public sApplication:ApplicationProvider,
    private barcodeScanner: BarcodeScanner,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendPage');
  }
  submitForm(){
    
  }
  scanCode(){
    this.barcodeScanner.scan().then((barcodeData) => {
      
      if (barcodeData.cancelled) {
        return false;
      }
      console.log(barcodeData.text);
      let address:any;
      let str:any = barcodeData.text;
      str = str.split(':');
      if(str[0] == "Superior"){
        str = str[1];
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
}
