import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MnemonicProvider } from '../mnemonic/mnemonic';
import { CnutilProvider } from '../cnutil/cnutil';
import { VanityAddressProvider } from '../vanity-address/vanity-address';
import { WalletModel } from '../../models/wallet-model';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import { Events } from 'ionic-angular';

/*
File : SystemWebViewClient.java
//super.onReceivedSslError(view, handler, error);
handler.proceed();
return;
*/

@Injectable()
export class ApplicationProvider {
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
    public Cnutil:CnutilProvider
  ) {
    this.initLocalStorage();
    this.initEvents();
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
  }

  eraseWallets(){
    this.wallets = new Array();
    this.saveWallets();
  }
  generatePaymentId(){
    if(this.openedWallet){

      this.openedWallet.paymentId = this.Cnutil.rand_8();
      this.generateIntegratedAddress();
      return true;
    }else {
      return false;
    }
  }
  importWallet(privateKey){
    privateKey = privateKey.trim();
    let v:any = this.decode_private_key(privateKey);
    let a:any = v.public_addr;
    let w:WalletModel = new WalletModel();
    w.generateRandomId();
    w.name = "Wallet #"+(this.wallets.length + 1);
    w.address = a;
    w.mnemonic = privateKey;

    this.wallets.push(w);
    this.saveWallets();
  }
  generateIntegratedAddress(){
    if(this.openedWallet && this.openedWallet.paymentId){
      let v = this.Cnutil.get_account_integrated_address(this.openedWallet.address,this.openedWallet.paymentId);
      this.openedWallet.integratedAddress = v;
    }
    
  }
  initLocalStorage(){
    this.storage.get('superiorwallet_wallets').then((val) => {
      val.forEach(element => {
        let o:WalletModel = new WalletModel();
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
formateTrx(received,sent){
  if(sent != 0){
    let t:any = sent - received;
    return (parseFloat(t)/100000000) + " SUP SENT";
  }else {
    return (parseFloat(received)/100000000) + " SUP RECEIVED";
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
    console.log(resultUnspentOuts);
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
  console.log(data);
  data = JSON.stringify(data);
  var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
  console.log(data);
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
      console.log(data);
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
  createWallet(){
    let g:any = this.vanityAddress.toggleGeneration();
    let w:WalletModel = new WalletModel();
    w.generateRandomId();
    w.name = "Wallet #"+(this.wallets.length + 1);
    w.address = g.found['address'];
    w.mnemonic = g.found['mnemonic'];

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
    let w:WalletModel = new WalletModel();
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
      this.http.get(this.pathBlockchainExplorer+'transaction/'+this.openedWallet.lastTransaction.hash).toPromise().then((response) =>
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
      switch (this.mnemonic_language) {
          case 'english':
              try {
                  seed = this.sMnemonic.mn_decode(w.mnemonic, null);
              } catch (e) {
                  // Try decoding as an electrum seed, on failure throw the original exception
                  try {
                      seed = this.sMnemonic.mn_decode(w.mnemonic, "electrum");
                  } catch (ee) {
                      throw e;
                  }
              }
              break;
          default:
              seed = this.sMnemonic.mn_decode(w.mnemonic, this.mnemonic_language);
              break; 
      }
      keys = this.sCnutil.create_address(seed);
      return keys;
  };
}
