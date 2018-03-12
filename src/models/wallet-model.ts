import { TransactionModel } from "./transaction-model";
import { CnutilProvider } from "../providers/cnutil/cnutil";

declare var JSBigInt;

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

    total_sent:any = JSBigInt.ZERO;;
    total_received_unlocked:any = JSBigInt.ZERO;;
    total_received:any = JSBigInt.ZERO;;

    secured:any = false;
    pinCode:any = false;
    constructor(public cnUtil:CnutilProvider) {
  
    }
    setKeys(keys){
        this.address = keys.public_addr;
    }
    init(datas){
        this.id = datas.id;
        this.name = datas.name;
        this.address = datas.address;
        this.mnemonic = datas.mnemonic;
        this.balance = datas.balance;
        this.secured = datas.secured;
        this.pinCode = datas.pinCode;
    }
    _toObject(){
      return {
        'id':this.id,
        'name':this.name,
        'address':this.address,
        'mnemonic':this.mnemonic,
        'secured':this.secured,
        'pinCode':this.pinCode
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
        //this.total_sent = this.datas.total_sent;
        this.total_received = new JSBigInt(this.datas.total_received);
        this.total_sent = new JSBigInt(this.datas.total_sent);
        if(this.datas.spent_outputs){
            this.datas.spent_outputs.forEach(spent_output => {
                var key_image = this.cachedKeyImage(
                    spent_output.tx_pub_key,
                    spent_output.out_index
                );
                if (spent_output.key_image !== key_image) {
                    this.total_sent = this.total_sent.subtract(spent_output.amount);
                }
            });
        }
        this.refreshBalance();
    }
    calculateBalance(){
        /*let b:any = 0;
        this.transactions.forEach(element => {
            b += element.total_received;
            b -= element.total_sent;
        });
        this.balance = (b/100000000).toFixed(8);*/
        this.refreshBalance();
    }
    getUnlockedBalance(){
        let b:any = this.total_received_unlocked.subtract(this.total_sent);
    
        return b/100000000;
    }
    getBalance(){
        let b:any = this.total_received.subtract(this.total_sent);
        return b/100000000;
    }
    getSpentInTransactions(){
        let v:any = 0;
        if(this.transactions){
            this.transactions.forEach(element => {
                v -= element.total_sent;
            });
        }
        
        return v;
    }
    refreshBalance(){
        
        this.balance =  this.getBalance();
        this.balanceUnlocked = this.getUnlockedBalance();
        let s:any = 0;
        let r:any = 0;
        if(this.transactions){
            this.transactions.forEach(element => {
                s+=element.total_sent;
                r+=element.total_received;
            });
        }
        s = new JSBigInt(s);
        r = new JSBigInt(r);


    }
    calculatePendingBalance(){
        this.refreshBalance();
        /*let b:any = 0;
        if(this.transactions){
            this.transactions.forEach(element => {
                if(element.unlock_time == 0){
                    b += element.total_received;
                    b -= element.total_sent;
                }
                
            });
        }*/
        
        //let b:any = this.datas.total_received - this.datas.total_sent;
        //this.balanceUnlocked = (b/100000000).toFixed(8);

    }
    setTransaction(result){
        
        this.datasTransaction = result;
        this.total_received = new JSBigInt(this.datasTransaction.total_received || 0);
        this.total_received_unlocked = new JSBigInt(this.datasTransaction.total_received_unlocked || 0);
        let trxTmp:Array<TransactionModel> = new Array();


        var transactions = this.datasTransaction.transactions || [];
        for (var i = 0; i < transactions.length; ++i) {
            if ((transactions[i].spent_outputs || []).length > 0)
            {
               
                for (var j = 0; j < transactions[i].spent_outputs.length; ++j)
                {
                    var key_image = this.cachedKeyImage(
                        transactions[i].spent_outputs[j].tx_pub_key,
                        transactions[i].spent_outputs[j].out_index
                    );
                    if (transactions[i].spent_outputs[j].key_image !== key_image)
                    {
                        transactions[i].total_sent = new JSBigInt(transactions[i].total_sent).subtract(transactions[i].spent_outputs[j].amount).toString();
                        transactions[i].spent_outputs.splice(j, 1);
                        j--;
                    }
                }
                
            }
/*if (transactions[i].payment_id.length == 16) {
                if (transactions[i].tx_pub_key) {
                    var decrypted_payment_id8
                        = this.decrypt_payment_id(transactions[i].payment_id,
                                            transactions[i].tx_pub_key,
                                            AccountService.getViewKey());
                    //console.log("decrypted_payment_id8: " + decrypted_payment_id8);
                    transactions[i].payment_id = decrypted_payment_id8;
                }
            }*/



            if (new JSBigInt(transactions[i].total_received || 0).add(transactions[i].total_sent || 0).compare(0) <= 0)
            {
                transactions.splice(i, 1);
                i--;
                continue;
            }


            transactions[i].amount = new JSBigInt(transactions[i].total_received || 0).subtract(transactions[i].total_sent || 0).toString();
            

            transactions[i].approx_float_amount = parseFloat(this.cnUtil.formatMoney(transactions[i].amount));
            transactions[i].timestamp = new Date(transactions[i].timestamp * 1000);
        }

        transactions.sort(function(a, b)
        {
            return b.id - a.id;

        });
        transactions.forEach(element => {
            let o:TransactionModel = new TransactionModel();
            o.init(element);
            trxTmp.push(o);
        });
        this.transactions = trxTmp;
        this.total_received = new JSBigInt(this.datasTransaction.total_received || 0);
        this.total_received_unlocked = new JSBigInt(this.datasTransaction.total_received_unlocked || 0);
        
       /* result.transactions.forEach(element => {
            for (var j = 0; j < element.spent_outputs.length; ++j)
            {
                var key_image = this.cachedKeyImage(
                    element.spent_outputs[j].tx_pub_key,
                    element.spent_outputs[j].out_index
                );
                if (element.spent_outputs[j].key_image !== key_image)
                {
                    element.total_sent = new JSBigInt(element.total_sent).subtract(element.spent_outputs[j].amount).toString();
                    element.spent_outputs.splice(j, 1);
                    j--;
                }
            }



            if ((element.total_received > 0 || element.total_sent > 0) && element.unlock_time != 0){
                let o:TransactionModel = new TransactionModel();
                o.init(element);
                trxTmp.push(o);
            }
        });
        trxTmp = trxTmp.reverse();
        this.transactions = trxTmp;*/
        this.refreshBalance();
    }
    decodeSeed(v){
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
  