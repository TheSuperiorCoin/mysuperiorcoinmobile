import { TransactionModel } from "./transaction-model";
import { CnutilProvider } from "../providers/cnutil/cnutil";

export class WalletModel {

    id:any;
    name:any;
    address:any;
    mnemonic:any;
    viewKey:any;
    spendKey:any;
    datas:any;
    datasTransaction:any;
    balance:any;
    balanceUnlocked:any;
    paymentId:any;
    integratedAddress:any;
    trxAmount:any;
    transactions:Array<TransactionModel>;
    lastTransaction:TransactionModel;
    key_images:any = [];
    spend_keys:any;
    view_keys:any;

    constructor(public cnUtil:CnutilProvider) {
  
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
        'mnemonic':this.mnemonic
      };
    }
    getAddress() {
        return this.address;
    }
    getViewKey() {
        return this.viewKey;
    }
    setLastTransactionInfosFromExplorer(result){
        if(this.lastTransaction){
            this.lastTransaction.setInfosFromExplorer(result);
        }
       
    }
    setInfosDatas(result){
        this.datas = result;
        this.calculatePendingBalance();
    }
    calculateBalance(){
        let b:any = 0;
        this.transactions.forEach(element => {
            b += element.total_received;
            b -= element.total_sent;
        });
        this.balance = (b/100000000).toFixed(8);
    }
    calculatePendingBalance(){
        let b:any = 0;
        if(this.transactions){
            this.transactions.forEach(element => {
                if(element.unlock_time == 0){
                    b += element.total_received;
                    b -= element.total_sent;
                }
                
            });
        }
        
        //let b:any = this.datas.total_received - this.datas.total_sent;
        this.balanceUnlocked = (b/100000000).toFixed(8);
    }
    setTransaction(result){
        this.datasTransaction = result;
        let trxTmp:Array<TransactionModel> = new Array();
        result.transactions.forEach(element => {
            let o:TransactionModel = new TransactionModel();
            o.init(element);
            trxTmp.push(o);
        });
        trxTmp = trxTmp.reverse();
        this.transactions = trxTmp;
        this.calculateBalance();
    }
    decodeSeed(v){
        console.log(v);
        this.spend_keys = v.spend;
        this.view_keys = v.view;

        this.viewKey = v.view.sec;
        this.spendKey = v.spend.sec;
    }
    totalPending(){
        
        if(this.datas){
            let t:any = (this.datas.total_received - this.datas.locked_funds);
            if(t == false) t = 0;
            return (parseFloat(t)/100000000).toFixed(8);
        }
        return 0;
    }
    totalSent(){
        
        if(this.datas){
            let t:any = this.datas.total_sent;
            if(t == false) t = 0;
            return (parseFloat(t)/100000000).toFixed(8);
        }
        return 0;
    }
    totalReceive(){
        
        if(this.datas){
            let t:any = this.datas.total_received;
            if(t == false) t = 0;
            return (parseFloat(t)/100000000);
        }
        return 0;
    }
    totalLocked(){
        
        if(this.datas){
            let t:any = this.datas.locked_funds;
            if(t == false) t = 0;
            return (parseFloat(t)/100000000);
        }
        return 0;
    }
    cachedKeyImage (tx_pub_key, out_index) {
       
        var cache_index = tx_pub_key + ':' + this.address + ':' + out_index;
        console.log(this.key_images);
        if (this.key_images[cache_index]) {
            return this.key_images[cache_index];
        }
        this.key_images[cache_index] = this.cnUtil.generate_key_image(
            tx_pub_key,
            this.getViewKey(),
            this.spend_keys.pub,
            this.spend_keys.sec,
            out_index
        ).key_image;
        console.log(this.key_images);

        return this.key_images[cache_index];
    }
    getPublicKeys(){
        return {view:this.view_keys.pub,spend:this.spend_keys.pub};
    }
    getSecretKeys(){
        return {view:this.view_keys.sec,spend:this.spend_keys.sec};
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
  