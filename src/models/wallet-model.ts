export class WalletModel {

    id:any;
    name:any;
    address:any;
    mnemonic:any;
    viewKey:any;
    spendKey:any;
    datas:any;
    transactions:any;
    balance:any;
    constructor() {
  
    }
  
    init(datas){
        this.id = datas.id;
        this.name = datas.name;
        this.address = datas.address;
        this.mnemonic = datas.mnemonic;
        this.balance = datas.balance;
    }
    _toObject(){
      return {
        'id':this.id,
        'name':this.name,
        'address':this.address,
        'mnemonic':this.mnemonic,
        'balance':this.balance
      };
    }
    decodeSeed(v){
        this.viewKey = v.view.sec;
        this.spendKey = v.spend.sec;
    }
    generateRandomId(){
        let text:String = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < 15; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        this.id = text;
      }
  }
  