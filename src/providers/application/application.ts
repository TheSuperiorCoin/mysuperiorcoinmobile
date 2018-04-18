import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MnemonicProvider } from '../mnemonic/mnemonic';
import { VanityAddressProvider } from '../vanity-address/vanity-address';
import { WalletModel } from '../../models/wallet-model';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { CnutilProvider } from '../cnutil/cnutil';
import CryptoJS from 'crypto-js';
//C:\Users\Bergery\Desktop\PROJETs\Mobile\superiorwallet\platforms\android\CordovaLib\src\org\apache\cordova\engine\SystemWebViewClient.java
//super.onReceivedSslError(view, handler, error);
//**handler.proceed();
//secretKey = "33hai3mGTNazGowpbMqrDJTbffgyeH3kFkLc0eIp"; 
@Injectable()
export class ApplicationProvider {
  secretKey:any = "33hai3mGTNazGowpbMqrDJTbffgyeH3kFkLc0eIp"; // NEVER CHANGE IT - USE TO ENCRYPT PIN CODE

  remotePath:string = "https://mysuperiorcoin.com:1984";
  pathBlockchainExplorer:string = "http://superior-coin.com:8081/api/";
  mnemonic_language:string = 'english';
  address:string;
  viewKey:string;
  mNemonic:string;
  keys:any;
  prefixQRCode:any = "Superior:";
  
  wallets:Array<WalletModel> = new Array();
  openedWallet:WalletModel;
  subscriptionRefresh = null;
  subscriptionRefreshTrx = null;
  subscriptionRefreshTransaction = null;
  constructor(
    public http: HttpClient,
    public sMnemonic: MnemonicProvider,
    public sCnutil:CnutilProvider,
    public vanityAddress:VanityAddressProvider,
    private storage: Storage,
    public events: Events,
    private toastCtrl: ToastController
  ) {
    this.initLocalStorage();
    this.initEvents();
  }
  encryptDatas(datas, key){
    var ciphertext = CryptoJS.AES.encrypt(datas, key);
    return ciphertext.toString();
  }
  decryptDatas(encryptedDatas, key){
    var bytes  = CryptoJS.AES.decrypt(encryptedDatas, key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }
  initEvents(){
    this.events.subscribe('refresh:address', () => {
      this.getAddressInfo();
    });
    this.events.subscribe('refresh:transactions', () => {
      this.getTrxInfo();
    });
    this.events.subscribe('call:get_unspent_outs', (trx) => {
      this.startUnspentOuts(trx);
    });
    this.events.subscribe('refresh:transaction', () => {
      this.getTransactionInfos();
    });
    this.events.subscribe('refresh:wallettrx', (no_blocks) => {
      this.refreshWallet(no_blocks);
    });
  }
  checkPinCode(pinCode){
    if(this.decryptDatas(this.openedWallet.pinCode, this.secretKey) == pinCode.join('')){
        return true;
    }
    return false;
  }
  encryptWallet(pinCode){
    if(this.openedWallet && this.openedWallet.secured == false){
      this.openedWallet.secured = true;
      this.openedWallet.pinCode = this.encryptDatas(pinCode, this.secretKey);
      this.openedWallet.mnemonic = this.encryptDatas(this.openedWallet.mnemonic, pinCode);
      this.saveWallets();
    }
  }
  disablePinCode(){
    if(this.openedWallet && this.openedWallet.secured == true){
      this.openedWallet.mnemonic = this.decryptDatas(this.openedWallet.mnemonic, this.decryptDatas(this.openedWallet.pinCode, this.secretKey));
      this.openedWallet.pinCode = null;
      this.openedWallet.secured = false;
      this.saveWallets();
    }
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
  eraseWallets(){
    this.wallets = new Array();
    this.saveWallets();
  }
  generatePaymentId(){
    if(this.openedWallet){

      this.openedWallet.paymentId = this.sCnutil.rand_8();
      this.generateIntegratedAddress();
      return true;
    }else {
      return false;
    }
  }
  importWallet(walletName, privateKey){
    privateKey = privateKey.trim();
    let v:any = this.decode_private_key(privateKey);
    let a:any = v.public_addr;
    let w:WalletModel = new WalletModel(this.sCnutil);
    w.generateRandomId();
    if(walletName == null){
      walletName =  "Wallet #" + this.sCnutil.rand_8().toUpperCase();
    }
    //w.pinCode = password;
    w.name = walletName;
    w.address = a;
    w.mnemonic = privateKey;

    this.wallets.push(w);
    this.saveWallets();
  }
  generateIntegratedAddress(){
    if(this.openedWallet && this.openedWallet.paymentId){
      let v = this.sCnutil.get_account_integrated_address(this.openedWallet.address,this.openedWallet.paymentId);
      this.openedWallet.integratedAddress = v;
    }
    
  }
  initLocalStorage(){
    this.storage.get('superiorwallet_wallets').then((val) => {
      val.forEach(element => {
        let o:WalletModel = new WalletModel(this.sCnutil);
        o.init(element);
        this.wallets.push(o);
      });

    }).catch(function(fallback) {
      
    });    
}
disconnect(){
  if (this.subscriptionRefresh != null) {
    this.subscriptionRefresh.unsubscribe();
  }
  if (this.subscriptionRefreshTrx != null) {
    this.subscriptionRefreshTrx.unsubscribe();
  }
  this.openedWallet = null;
}
stopTransactionRefresh(){
  if (this.subscriptionRefreshTransaction != null) {
    this.subscriptionRefreshTransaction.unsubscribe();
  }
}
formateTrx(trx){
  if(trx.total_sent != 0){
    let t:any = trx.total_sent - trx.total_received;
    return "-"+(parseFloat(t)/100000000) + " SUP";
  }else {
    return (parseFloat(trx.total_received)/100000000) + " SUP";
  }
}
/*
amount:0
new_address:false
outputs:[]
per_kb_fee:1595092
status:"success"
*/
startUnspentOuts(trx){
  this.getUnspentOuts(trx).then((resultUnspentOuts) => { 
    /*this.sApplication.getRandomOuts(resultUnspentOuts).then((resultRandomOuts) => { 
      console.log(resultRandomOuts);
    }, (err) => {
      
      console.log(err);
    });*/
  }, (err) => {
    
    console.log(err);
  });
}
getUnspentOuts(trx){
    
  let data:any = {
    address: this.openedWallet.address, 
    amount: trx.amountToSend.toString(),
    dust_threshold: trx.dust_threshold.toString(), 
    mixin: parseInt(trx.mixin),
    use_dust: false,
    view_key: this.openedWallet.viewKey
  };
  data = JSON.stringify(data);
  var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
  return new Promise((resolve, reject) => {

    this.http.post(this.remotePath+'/get_unspent_outs', data, header).toPromise().then((response) =>
    {
      let res = response;
      resolve(res);
    }) 
    .catch((error) =>
    {
      reject(error);
    });
  });
}


  getRandomOuts(trx){     
    let data:any = {
      amounts: this.openedWallet.address, 
      view_key: this.openedWallet.viewKey,
      amount:trx.amountToSend,
      mixin:trx.mixin,
      use_dust:false
    };
    
    data = JSON.stringify(data);
    var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
    
    return new Promise((resolve, reject) => {
      resolve(data);
      /*this.http.post(this.remotePath+'/get_random_outs', data, header).toPromise().then((response) =>
      {
        let res = response;
        resolve(res);
      }) 
      .catch((error) =>
      {
        reject(error);
      });*/
    });
  }
  createWallet(walletName){
    let seed:any = this.sCnutil.rand_32();
    //let g:any = this.vanityAddress.toggleGeneration();
    let w:WalletModel = new WalletModel(this.sCnutil);
    w.generateRandomId();
    if(walletName == null){
      walletName =  "Wallet #" + this.sCnutil.rand_8().toUpperCase();
    }
    /*if(password && password != ""){
      w.secured = true;
      w.pinCode = password;
    }*/
    
    w.name = walletName;
    w.setKeys(this.sCnutil.create_address(seed));
    w.mnemonic = this.sMnemonic.mn_encode(seed, null);

    this.wallets.push(w);
    this.saveWallets();
    //this.addTestWallet();
  }
  saveWallets(){
    let configObj = this.getWalletsObj();
    this.storage.set('superiorwallet_wallets', configObj);
  }
  getWalletsObj(){
    let config:Array<Object> = new Array();
    this.wallets.forEach(element => {
      config.push(element._toObject());
    });
    return config;
  } 
  addTestWallet(){
    let g:any = this.vanityAddress.toggleGeneration();
    let w:WalletModel = new WalletModel(this.sCnutil);
    w.generateRandomId();
    w.name = "Wallet Test #"+(this.wallets.length + 1);
    w.address = "";
    w.mnemonic = "";

    this.wallets.push(w);
    this.saveWallets();
  }
  
  startEventsRefresh(){
    if (this.subscriptionRefresh != null) {
      this.subscriptionRefresh.unsubscribe();
    }
    if (this.subscriptionRefreshTrx != null) {
      this.subscriptionRefreshTrx.unsubscribe();
    }
    this.subscriptionRefresh = Observable.interval(5000).subscribe(()=>{
      this.events.publish('refresh:address');
    });
    this.subscriptionRefreshTrx = Observable.interval(5000).subscribe(()=>{
      this.events.publish('refresh:transactions');
    });
  }
  startTransactionRefresh(){
    this.events.publish('refresh:transaction');
    this.subscriptionRefreshTransaction = Observable.interval(5000).subscribe(()=>{
      this.events.publish('refresh:transaction');
    });
  }
  deleteWallet(){
    let index = this.wallets.indexOf(this.openedWallet);
    if(index > -1){ 
      this.wallets.splice(index, 1);
      this.disconnect();
      this.saveWallets();
    }
  }
  
  login() {
    
    this.openedWallet.decodeSeed(this.decode_seed(this.openedWallet));
    let data:any = {
        address: this.openedWallet.address, 
        view_key: this.openedWallet.viewKey,
      withCredentials: true,
      create_account: false
    };
    data = JSON.stringify(data);

      
    var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/login', data, header).toPromise().then((response) =>
      {
        let res = response;
        this.events.publish('refresh:address');
        this.events.publish('refresh:transactions');
        this.startEventsRefresh();
        resolve(res);
      }) 
      .catch((error) =>
      {
        console.log(error);
        reject(error);
      });
    });
  }


  refreshWallet(no_blocks){
    this.refreshWalletInfos(no_blocks).then((result:any) => {    
      this.presentToast(result.status);
    }, (err) => {
      console.log(err);
    });
  }
  
  getAddressInfo(){
    this.requestAddressInfo().then((result:any) => {    
      if(this.openedWallet){
        this.openedWallet.setInfosDatas(result);
      } 
      
    }, (err) => {
      console.log(err);
    });
  }
  getTrxInfo(){
    this.requestTrxInfo().then((result) => {    
      if(this.openedWallet){
        this.openedWallet.setTransaction(result);
      } 

    }, (err) => {
      console.log(err);
    });
  }
  getTransactionInfos(){
    this.requestTransactionInfo().then((result) => {    
      if(this.openedWallet){
        this.openedWallet.setLastTransactionInfosFromExplorer(result);
      } 

    }, (err) => {
      console.log(err);
    });
  }
  requestTransactionInfo() {
  
    return new Promise((resolve, reject) => {
      if(this.openedWallet.lastTransaction){
        this.http.get(this.pathBlockchainExplorer+'transaction/'+this.openedWallet.lastTransaction.hash).toPromise().then((response) =>
      {
        let res = response;
        
        resolve(res);
      }) 
      .catch((error) =>
      {
        reject(error);
      });
      }else {
        reject();
      }
      
    });
  }
  requestTrxInfo() {
     
    let data:any = {
      address: this.openedWallet.address, 
      view_key: this.openedWallet.viewKey
    };
    
    data = JSON.stringify(data);
    var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/get_address_txs', data, header).toPromise().then((response) =>
      {
        let res = response;
        
        resolve(res);
      }) 
      .catch((error) =>
      {
        reject(error);
      });
    });
  }
  refreshWalletInfos(no_blocks) {
     
    let data:any = {
      address: this.openedWallet.address, 
      view_key: this.openedWallet.viewKey,
      no_blocks_to_import: no_blocks.toString()
    };
    
    data = JSON.stringify(data);
    
    var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/import_recent_wallet_request', data, header).toPromise().then((response) =>
      {
        let res = response;
        
        resolve(res);
      }) 
      .catch((error) =>
      {
        reject(error);
      });
    });
  }
  requestAddressInfo() {
     
    let data:any = {
      address: this.openedWallet.address, 
      view_key: this.openedWallet.viewKey
    };
    
    data = JSON.stringify(data);
    var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/get_address_info', data, header).toPromise().then((response) =>
      {
        let res = response;
        
        resolve(res);
      }) 
      .catch((error) =>
      {
        reject(error);
      });
    });
  }
  addressInfo() {
      
    this.openedWallet.decodeSeed(this.decode_seed(this.openedWallet));
    let data:any = {
      address: this.openedWallet.address, 
      view_key: this.openedWallet.viewKey
    };
    
    data = JSON.stringify(data);
    var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };

    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/get_address_info', data, header).toPromise().then((response) =>
      {
        let res = response;
        
        resolve(res);
      }) 
      .catch((error) =>
      {
        console.log(error);
        reject(error);
      });
    });
  }
  decode_private_key(privateKey){
      var seed;
      var keys;
      switch (this.mnemonic_language) {
          case 'english':
              try {
                  seed = this.sMnemonic.mn_decode(privateKey, null);
              } catch (e) {
                  // Try decoding as an electrum seed, on failure throw the original exception
                  try {
                      seed = this.sMnemonic.mn_decode(privateKey, "electrum");
                  } catch (ee) {
                      throw e;
                  }
              }
              break;
          default:
              seed = this.sMnemonic.mn_decode(privateKey, this.mnemonic_language);
              break; 
      }
      keys = this.sCnutil.create_address(seed);
      return keys;
  }
  decode_seed(w)
  { 
      var seed;
      var keys;
      let mnemonic:any = w.mnemonic;
      if(w.secured){
        mnemonic = this.decryptDatas(mnemonic, this.decryptDatas(w.pinCode, this.secretKey));
      }

      switch (this.mnemonic_language) {
          case 'english':
              try {
                  seed = this.sMnemonic.mn_decode(mnemonic, null);
              } catch (e) {
                  // Try decoding as an electrum seed, on failure throw the original exception
                  try {
                      seed = this.sMnemonic.mn_decode(mnemonic, "electrum");
                  } catch (ee) {
                      throw e;
                  }
              }
              break;
          default:
              seed = this.sMnemonic.mn_decode(mnemonic, this.mnemonic_language);
              break; 
      }
      keys = this.sCnutil.create_address(seed);
      return keys;
  }
  decryptMnemonic()
  { 
      let w:any = this.openedWallet;
      let mnemonic:any = w.mnemonic;
      if(w.secured){
        mnemonic = this.decryptDatas(mnemonic, this.decryptDatas(w.pinCode, this.secretKey));
      }
      return mnemonic;
  };
}
