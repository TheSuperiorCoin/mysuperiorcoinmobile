import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MnemonicProvider } from '../mnemonic/mnemonic';
import { CnutilProvider } from '../cnutil/cnutil';
import { VanityAddressProvider } from '../vanity-address/vanity-address';
import { WalletModel } from '../../models/wallet-model';
import { Storage } from '@ionic/storage';


@Injectable()
export class ApplicationProvider {
  remotePath:string = "https://mysuperiorcoin.com:1984";
  mnemonic_language:string = 'english';
  address:string;
  viewKey:string;
  mNemonic:string;
  keys:any;

  wallets:Array<WalletModel> = new Array();
  openedWallet:WalletModel;

  constructor(
    public http: HttpClient,
    public sMnemonic: MnemonicProvider,
    public sCnutil:CnutilProvider,
    public vanityAddress:VanityAddressProvider,
    private storage: Storage
  ) {
    this.initLocalStorage();
  }
  eraseWallets(){
    this.wallets = new Array();
    this.saveWallets();
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
  createWallet(){
    let g:any = this.vanityAddress.toggleGeneration();
    console.log(g);
    let w:WalletModel = new WalletModel();
    w.generateRandomId();
    w.name = "Wallet #"+(this.wallets.length + 1);
    w.address = g.found['address'];
    w.mnemonic = g.found['mnemonic'];

    this.wallets.push(w);
    this.saveWallets();
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
  login() {
    let headers = new Headers(
      {
        'Content-Type' : 'application/json'
      });
      let options:any = new RequestOptions({ headers: headers });
      
    
    let data:any = {
      address: this.address, 
      view_key: this.viewKey,
      withCredentials: true,
      create_account: false
    };
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/login', data, options).toPromise().then((response) =>
      {
        //let res = JSON.parse(response['_body']);
        let res = response;
        console.log(res);
        resolve(res);
      }) 
      .catch((error) =>
      {
        console.log(error);
        reject(error);
      });
    });
  }
  addressInfo() {
    let headers = new Headers(
      {
        'Content-Type' : 'application/json'
      });
      let options:any = new RequestOptions({ headers: headers });
      
    this.openedWallet.decodeSeed(this.decode_seed(this.openedWallet));
    let data:any = {
      address: this.openedWallet.address, 
      view_key: this.openedWallet.viewKey
    };
    
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      this.http.post(this.remotePath+'/get_address_info', data, options).toPromise().then((response) =>
      {
        let res = response;
        console.log(JSON.stringify(res));
        
        resolve(res);
      }) 
      .catch((error) =>
      {
        console.log(error);
        reject(error);
      });
    });
  }

  decode_seed(w)
  { 
      var seed;
      var keys;
      console.log(w);
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
