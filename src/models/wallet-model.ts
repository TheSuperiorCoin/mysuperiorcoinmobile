import { TransactionModel } from "./transaction-model";

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
        'mnemonic':this.mnemonic
      };
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
    generateRandomId(){
        let text:String = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < 15; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        this.id = text;
      }
  }
  