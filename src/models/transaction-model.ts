declare var JSBigInt;
export class TransactionModel {

    coinbase:any;
    hash:string;
    height:any;
    id:any;
    mempool:any;
    mixin:any;
    payment_id:any;
    timestamp:any;
    total_received:any;
    total_sent:any;
    tx_pub_key:any;
    unlock_time:any;
    blockchainInfos:any;
    fee:any;
    confirmations:any;
    constructor() {
  
    }
  
    init(datas){
        this.coinbase = datas.coinbase;
        this.hash = datas.hash;
        this.height = datas.height;
        this.id = datas.id;
        this.mempool = datas.mempool;
        this.mixin = datas.mixin;
        this.payment_id = datas.payment_id;
        this.timestamp = datas.timestamp;
        this.total_received = datas.total_received;
        this.total_sent = datas.total_sent;
        this.tx_pub_key = datas.tx_pub_key;
        this.unlock_time = datas.unlock_time;
    }
    setInfosFromExplorer(result){
        this.confirmations = result.data.confirmations;
        this.fee = result.data.tx_fee;
        this.blockchainInfos = JSON.stringify(result);
        console.log();
    }
    _toObject(){
      return {
        //'id':this.id,
      };
    }
    getFee(){
        if(this.fee){
            return this.fee / 100000000;
        }
        return 0;
    }
    getAmount(){

        return (this.total_received - this.total_sent) / 100000000;
    }
    isReceived(){
        if(this.total_sent){
            return false;
        }else {
            return true;
        }
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
  