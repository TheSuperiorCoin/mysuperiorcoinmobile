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
      this.receiverAddress = barcodeData.text;
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  validForm(){
    return true;
  }
}
