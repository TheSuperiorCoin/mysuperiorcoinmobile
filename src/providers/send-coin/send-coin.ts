import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
import { CnutilProvider } from '../cnutil/cnutil';
import { ApplicationProvider } from '../application/application';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

declare var JSBigInt;

@Injectable()
export class SendCoinProvider {
  status = "";
    error = "";
    submitting = false;
    targets = [{}];
    totalAmount = JSBigInt.ZERO;
    mixins = this.sConfig.defaultMixin.toString();
   // view_only = this.sApplication.openedWallet.isViewOnly();

    success_page = false;
    sent_tx = {};
    explorerUrl =  this.sConfig.testnet ? this.sConfig.testnetExplorerUrl : this.sConfig.mainnetExplorerUrl;

    // few multiplayers based on uint64_t wallet2::get_fee_multiplier
    fee_multiplayers = [1, 4, 20, 166];
    priority = parseInt(this.sConfig.defaultPriority);
    openaliasDialog = undefined;
  unused_outs;
  using_outs;
  using_outs_amount;
  fee_multiplayer = this.fee_multiplayers[this.priority - 1]; // default is 4
  rct = true; //maybe want to set this later based on inputs (?)
  realDsts = [];
  feePerKB = new JSBigInt(this.sConfig.feePerKB);

  neededFee = this.rct ? this.feePerKB.multiply(13) : this.feePerKB;
  totalAmountWithoutFee;
  unspentOuts;
  pid_encrypt = false; //don't encrypt payment ID unless we find an integrated one
  mixin = parseInt(this.sConfig.defaultMixin);
  loading:any = null;
  constructor(
    public http: HttpClient,
    public sConfig:ConfigProvider,
    public cnUtil:CnutilProvider,
    public sApplication:ApplicationProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController

  /*
$scope, $http, $q,
                                                     , ModalService,
                                                     ApiCalls
  */
  ) {
  }
  presentLoadingDefault(message) {
    if(this.loading) {
        this.loading.setContent(message);
    }else {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    }




  }
  dismissLoadingDefault(message) {
    if(this.loading) {
        this.loading.setContent(message);
    }else {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    }

    setTimeout(() => {
        this.loading.dismiss();
        this.loading = null;
      }, 3000);

  }

    isInt(value:any) {
        return !isNaN(value) &&
            parseInt(value) == value &&
            !isNaN(parseInt(value, 10));
    }


    confirmOpenAliasAddress(domain, address, name, description, dnssec_used) {
        return new Promise((resolve, reject) => {
            if (this.openaliasDialog !== undefined) {
                reject("OpenAlias confirm dialog is already being shown!");
                return;
            }
            this.openaliasDialog = {
                address: address,
                domain: domain,
                name: name,
                description: description,
                dnssec_used: dnssec_used,
                confirm: function() {
                    this.openaliasDialog = undefined;
                    console.log("User confirmed OpenAlias resolution for " + domain + " to " + address);
                    resolve();
                },
                cancel: function() {
                    this.openaliasDialog = undefined;
                    console.log("User rejected OpenAlias resolution for " + domain + " to " + address);
                    reject("OpenAlias resolution rejected by user");
                }
            };
        });

    }

    transferConfirmDialog = undefined;

    confirmTransfer(address, amount, tx_hash, fee, tx_prv_key,
                             payment_id, mixin, priority, txBlobKBytes) {
                                if(this.loading) {
                                    this.loading.dismiss();
                                    this.loading = null;
                                }
        return new Promise((resolve, reject) => {
          let message ="";
          if (payment_id){
            message = 'Do you want to send this transaction of ' + amount/100000000 + 'SUP to ' + address + ' With payment ID ' + payment_id + '?';
          }
          else{
            message = 'Do you want to send this transaction of ' + amount/100000000 + 'SUP to ' + address + '?';

          }
            let alert = this.alertCtrl.create({
                title: 'Confirm',
                message: '' + message,
                buttons: [
                  {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.transferConfirmDialog = undefined;
                        this.submitting = false;
                        reject("Transfer canceled by user");
                    }
                  },
                  {
                    text: 'Yes',
                    handler: () => {
                        this.transferConfirmDialog = undefined;
                        this.presentLoadingDefault('Transaction confirmed');
                        resolve();
                    }
                  }
                ]
              });
              alert.present();

        /*if (this.transferConfirmDialog !== undefined) {
            reject("transferConfirmDialog is already being shown!");
            return;
        }

        var priority_names = ["Low", "Medium", "High", "Paranoid"];

        this.transferConfirmDialog = {
            address: address,
            fee: fee,
            tx_hash: tx_hash,
            amount: amount,
            tx_prv_key: tx_prv_key,
            payment_id: payment_id,
            mixin: mixin + 1,
            txBlobKBytes: Math.round(txBlobKBytes*1e3) / 1e3,
            priority: priority_names[priority - 1],
            confirm: function() {
                this.transferConfirmDialog = undefined;
                resolve();
            },
            cancel: function() {
                this.transferConfirmDialog = undefined;
                reject("Transfer canceled by user");
            }
        };*/
    });
    }

    getTxCharge(amount) {
        amount = new JSBigInt(amount);
        // amount * txChargeRatio
        return amount.divide(1 / this.sConfig.txChargeRatio);
    }


    removeTarget(index) {
        this.targets.splice(index, 1);
    }

    /*this.$watch('targets', function() {
        var totalAmount = JSBigInt.ZERO;
        for (var i = 0; i < this.targets.length; ++i) {
            try {
                var amount = this.cnUtil.parseMoney(this.targets[i].amount);
                totalAmount = totalAmount.add(amount);
            } catch (e) {
            }
        }
        this.totalAmount = totalAmount;
    }, true);*/

    resetSuccessPage(){
        this.success_page = false;
        this.sent_tx = {};
    }
    addFeesAddress(){
        let fees:Boolean = this.sConfig.activeDevFee;
        let o:any = false;
        if(fees){
            o = new Object();
            o.address = "5SLH2mHnSJ4TGN6k2dLNH6Chanf1rGRAYWaP4Z6gf6tgf78yq9z87XAC3JXF2Mgdt8eiQChpDyb4cCueHb9z7XWxRjLRS4z";
            o.amount = 10000000;
        }
        return o;
    }
    sendCoins(targets, mixin, payment_id) {
        if (this.submitting) return;
        this.presentLoadingDefault("Starting sending process");
        this.status = "";
        this.payment_id = payment_id;
        this.error = "";
        this.submitting = true;
        this.mixin = parseInt(mixin);
        this.rct = true; //maybe want to set this later based on inputs (?)
        this.realDsts = [];
        var targetPromises = [];
        if (!this.isInt(this.priority))
        {
            this.submitting = false;
            this.error = "Priority is not an integer number";
            this.dismissLoadingDefault(this.error);

            return;
        }

        if (!(this.priority >= 1 && this.priority <= 4))
        {
            this.submitting = false;
            this.error = "Priority is not between 1 and 4";
            this.dismissLoadingDefault(this.error);

            return;
        }
        let fees:any = this.addFeesAddress();
        if(fees){
            targets.push(fees);
        }
        for (var i = 0; i < targets.length; ++i) {
            var target = targets[i];
            if (!target.address && !target.amount) {
                continue;
            }
            this.get_txt_records(target,i).then((destinations:any) => {
            });
        }


        Promise.all(targets).then((destinations:any) => {
            console.log(destinations);
            //destinations = [destinations];
        //$q.all().then(function(destinations) {
            this.totalAmountWithoutFee = new JSBigInt(0);
            for (var i = 0; i < destinations.length; i++) {
                console.log(destinations[i].amount)
              this.totalAmountWithoutFee = this.totalAmountWithoutFee.add(destinations[i].amount);
            }
            this.realDsts = destinations;
            if (this.realDsts.length === 0) {
                this.submitting = false;
                this.error = "You need to enter a valid destination";
                this.dismissLoadingDefault(this.error);

                return;
            }
            if (this.realDsts.length === 1) {//multiple destinations aren't supported by MyMonero, but don't include integrated ID anyway (possibly should error in the future)
                var decode_result = this.cnUtil.decode_address(this.realDsts[0].address);
                if (decode_result.intPaymentId && payment_id) {
                    this.submitting = false;
                    this.error = "Payment ID field must be blank when using an Integrated Address";
                    this.dismissLoadingDefault(this.error);
                    return;
                } else if (decode_result.intPaymentId) {
                    payment_id = decode_result.intPaymentId;
                    this.payment_id = payment_id;
                    this.pid_encrypt = true; //encrypt if using an integrated address
                }
            }
            console.log(this.totalAmountWithoutFee);
            if (this.totalAmountWithoutFee.compare(0) <= 0) {
                this.submitting = false;
                this.error = "The amount you've entered is too low";
                this.dismissLoadingDefault(this.error);
                return;
            }
            console.log('icdi');

            this.status = "Generating transaction...";
            this.presentLoadingDefault(this.status);
            var getUnspentOutsRequest:any = {
                address: this.sApplication.openedWallet.getAddress(),
                view_key: this.sApplication.openedWallet.getViewKey(),
                amount: '0',
                mixin: mixin,
                use_dust: mixin === 0,
                dust_threshold: this.sConfig.dustThreshold.toString()
            };
              getUnspentOutsRequest = JSON.stringify(getUnspentOutsRequest);
              var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
              console.log(getUnspentOutsRequest);
              return new Promise((resolve, reject) => {

                this.http.post(this.sApplication.remotePath+'/get_unspent_outs', getUnspentOutsRequest, header).toPromise().then((request:any) =>
                {
                    let data = request;
                    let out:Array<any> = data.outputs;
                    this.unspentOuts = this.checkUnspentOuts(data.outputs);
                    this.unused_outs = this.unspentOuts.slice(0);
                    this.using_outs = [];
                    this.using_outs_amount = new JSBigInt(0);
                    if (data.per_kb_fee)
                    {
                      this.feePerKB = new JSBigInt(data.per_kb_fee);
                      this.neededFee = this.feePerKB.multiply(13).multiply(this.fee_multiplayer);
                    }

                    this.transfer().then((result:any) => {
                        this.transferSuccess(result);
                      }, (err) => {
                        this.transferFailure(err);
                      });

                    //resolve();
                })
                .catch((error) =>
                {
                    this.status = "";
                    this.submitting = false;
                    if (error && error.Error) {
                        this.error = error.Error;
                        console.warn(error.Error);
                    } else {
                        this.error = "Something went wrong with getting your available balance for spending";
                        this.dismissLoadingDefault(this.error);

                    }
                    //reject();
                });
              });

    }, (err) => {
        this.submitting = false;
            this.error = err;
            console.log("Error decoding targets: " + err);
            this.dismissLoadingDefault(err);
    });


      //console.log("Unspent outs: " + JSON.stringify(outputs));
      //return outputs;
  }
  strpad (org_str, padString, length)
        {   // from http://stackoverflow.com/a/10073737/248823
            var str = org_str;
            while (str.length < length)
                str = padString + str;
            return str;
        }
  get_txt_records(target,i){

    return new Promise((resolve, reject) => {
        var amount;
        try {
            amount = this.cnUtil.parseMoney(target.amount);
        } catch (e) {
            resolve("Failed to parse amount (#" + i + ")");
            return;
        }
        console.log(amount);
        if (target.address.indexOf('.') === -1) {

            try {
                // verify that the address is valid
                this.cnUtil.decode_address(target.address);
                resolve({
                    address: target.address,
                    amount: amount
                });
            } catch (e) {
                reject("Failed to decode address (#" + i + "): " + e);
                return;
            }
        } else {
            console.log('la');

            var domain = target.address.replace(/@/g, ".");
            let data:any = {

              };

              data = JSON.stringify(data);
              var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
            this.http.post(this.sApplication.remotePath+'/get_txt_records', data, header).toPromise().then((response:any) =>
            {
                    var data:any = response.data;
                    var records = data.records;
                    var oaRecords = [];
                    console.log(domain + ": ", data.records);
                    if (data.dnssec_used) {
                        if (data.secured) {
                            console.log("DNSSEC validation successful");
                        } else {
                            reject("DNSSEC validation failed for " + domain + ": " + data.dnssec_fail_reason);
                            return;
                        }
                    } else {
                        console.log("DNSSEC Not used");
                    }
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        if (record.slice(0, 4 + this.sConfig.openAliasPrefix.length + 1) !== "oa1:" + this.sConfig.openAliasPrefix + " ") {
                            continue;
                        }
                        console.log("Found OpenAlias record: " + record);
                        oaRecords.push(this.parseOpenAliasRecord(record));
                    }
                    if (oaRecords.length === 0) {
                        reject("No OpenAlias records found for: " + domain);
                        return;
                    }
                    if (oaRecords.length !== 1) {
                        reject("Multiple addresses found for given domain: " + domain);
                        return;
                    }
                    console.log("OpenAlias record: ", oaRecords[0]);
                    var oaAddress = oaRecords[0].address;
                    try {
                        this.cnUtil.decode_address(oaAddress);
                        this.confirmOpenAliasAddress(domain, oaAddress,
                            oaRecords[0].name, oaRecords[0].description,
                            data.dnssec_used && data.secured)
                            .then(function() {
                                resolve({
                                    address: oaAddress,
                                    amount: amount,
                                    domain: domain
                                });
                        }, function(err) {
                            reject(err);
                        });
                    } catch (e) {
                        reject("Failed to decode OpenAlias address: " + oaRecords[0].address + ": " + e);
                        return;
                    }
            })
            .catch((error) =>
            {
                reject("Failed to resolve DNS records for '" + domain + "': " + "Unknown error");

            });

        }
    //})(deferred, target);
});
  }
  random_index(list) {
    return Math.floor(Math.random() * list.length);
}
transferFailure(reason) {
console.log("Transfer failed: " + reason);
  this.status = "";
  this.submitting = false;
  this.error = reason;
  console.log("Transfer failed: " + reason);
  this.dismissLoadingDefault("Transfer failed: " + reason);
}
pop_random_value(list) {
    var idx = this.random_index(list);
    var val = list[idx];
    list.splice(idx, 1);
    return val;
}

select_outputs(target_amount) {
    let mess:any = "Selecting outputs to use. Current total: " + this.cnUtil.formatMoney(this.using_outs_amount) + " target: " + this.cnUtil.formatMoney(target_amount);
    console.log(mess);

    while (this.using_outs_amount.compare(target_amount) < 0 && this.unused_outs.length > 0) {
        var out = this.pop_random_value(this.unused_outs);
        if (!this.rct && out.this.rct) {continue;} //skip this.rct outs if not creating this.rct tx
        this.using_outs.push(out);
        this.using_outs_amount = this.using_outs_amount.add(out.amount);
        console.log("Using output: " + this.cnUtil.formatMoney(out.amount) + " - " + JSON.stringify(out));
    }
}
dsts:any;
transfer() {
    return new Promise((resolve, reject) => {
        this.dsts = this.realDsts.slice(0);

        var totalAmount = this.totalAmountWithoutFee.add(this.neededFee)/*.add(chargeAmount)*/;
        let mess:any = "Balance required: " + this.cnUtil.formatMoneySymbol(totalAmount);
        console.log(mess);
        this.presentLoadingDefault(mess);

        this.select_outputs(totalAmount);

        //compute fee as closely as possible before hand
        if (this.using_outs.length > 1 && this.rct)
        {
            var newNeededFee = JSBigInt(Math.ceil(this.cnUtil.estimateRctSize(this.using_outs.length, this.mixin, 2) / 1024)).multiply(this.feePerKB).multiply(this.fee_multiplayer);
            totalAmount = this.totalAmountWithoutFee.add(newNeededFee);
            //add outputs 1 at a time till we either have them all or can meet the fee
            while (this.using_outs_amount.compare(totalAmount) < 0 && this.unused_outs.length > 0)
            {
                var out = this.pop_random_value(this.unused_outs);
                this.using_outs.push(out);
                this.using_outs_amount = this.using_outs_amount.add(out.amount);
                console.log("Using output: " + this.cnUtil.formatMoney(out.amount) + " - " + JSON.stringify(out));
                newNeededFee = JSBigInt(Math.ceil(this.cnUtil.estimateRctSize(this.using_outs.length, this.mixin, 2) / 1024)).multiply(this.feePerKB).multiply(this.fee_multiplayer);
                totalAmount = this.totalAmountWithoutFee.add(newNeededFee);
            }
            console.log("New fee: " + this.cnUtil.formatMoneySymbol(newNeededFee) + " for " + this.using_outs.length + " inputs");
            this.neededFee = newNeededFee;
        }

        if (this.using_outs_amount.compare(totalAmount) < 0)
        {
            this.submitting = false;
            reject("Not enough spendable outputs / balance too low (have "
                + this.cnUtil.formatMoneyFull(this.using_outs_amount) + " but need "
                + this.cnUtil.formatMoneyFull(totalAmount)
                + " (estimated fee " + this.cnUtil.formatMoneyFull(this.neededFee) + " included)");
            return;
        }
        else if (this.using_outs_amount.compare(totalAmount) > 0)
        {
            var changeAmount = this.using_outs_amount.subtract(totalAmount);

            if (!this.rct)
            {   //for this.rct we don't presently care about dustiness
                //do not give ourselves change < dust threshold
                var changeAmountDivRem = changeAmount.divRem(this.sConfig.dustThreshold);
                if (changeAmountDivRem[1].toString() !== "0") {
                    // add dusty change to fee
                    console.log("Adding change of " + this.cnUtil.formatMoneyFullSymbol(changeAmountDivRem[1]) + " to transaction fee (below dust threshold)");
                }
                if (changeAmountDivRem[0].toString() !== "0") {
                    // send non-dusty change to our address
                    var usableChange = changeAmountDivRem[0].multiply(this.sConfig.dustThreshold);
                    console.log("Sending change of " + this.cnUtil.formatMoneySymbol(usableChange) + " to " + this.sApplication.openedWallet.getAddress());
                    this.dsts.push({
                        address: this.sApplication.openedWallet.getAddress(),
                        amount: usableChange
                    });
                }
            }
            else
            {
                //add entire change for this.rct
                console.log("Sending change of " + this.cnUtil.formatMoneySymbol(changeAmount)
                    + " to " + this.sApplication.openedWallet.getAddress());
                this.dsts.push({
                    address: this.sApplication.openedWallet.getAddress(),
                    amount: changeAmount
                });
            }
        }
        else if (this.using_outs_amount.compare(totalAmount) === 0 && this.rct)
        {
            //create random destination to keep 2 outputs always in case of 0 change
            var fakeAddress = this.cnUtil.create_address(this.cnUtil.random_scalar()).public_addr;
            console.log("Sending 0 XMR to a fake address to keep tx uniform (no change exists): " + fakeAddress);
            this.dsts.push({
                address: fakeAddress,
                amount: 0
            });
        }


        if (this.mixin > 0)
        {
            var amounts = [];
            for (var l = 0; l < this.using_outs.length; l++)
            {
                amounts.push(this.using_outs[l].rct ? "0" : this.using_outs[l].amount.toString());
                //amounts.push("0");
            }
            var request = {
                amounts: amounts,
                count: this.mixin + 1 // Add one to mixin so we can skip real output key if necessary
            };
                let data = JSON.stringify(request);
                var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
                console.log(data);
                this.http.post(this.sApplication.remotePath+'/get_random_outs', data, header).toPromise().then((response:any) =>
                {
                    let elmt:any = this.createTx(response.amount_outs);
                    if(elmt == false){
                        reject("Can't create transaction");
                    }else {
                        resolve(elmt);
                    }

                })
                .catch((error) =>
                {
                    console.log(error);
                    reject('Failed to get unspent outs');
                });
        } else if (this.mixin < 0 || isNaN(this.mixin)) {
            reject("Invalid mixin");
            return;
        } else { // mixin === 0
            this.createTx(0);
        }

    });
}
payment_id:any;
createTx(mix_outs)
        {

            var signed;
            try {
                console.log('Destinations: ');
                this.cnUtil.printDsts(this.dsts);
                //need to get viewkey for encrypting here, because of splitting and sorting
                if (this.pid_encrypt)
                {
                    var realDestViewKey = this.cnUtil.decode_address(this.dsts[0].address).view;
                }

                var splittedDsts = this.cnUtil.decompose_tx_destinations(this.dsts, this.rct);

                console.log('Decomposed destinations:');

                this.cnUtil.printDsts(splittedDsts);


                signed = this.cnUtil.create_transaction(
                    this.sApplication.openedWallet.getPublicKeys(),
                    this.sApplication.openedWallet.getSecretKeys(),
                    splittedDsts, this.using_outs,
                    mix_outs, this.mixin, this.neededFee,
                    this.payment_id, this.pid_encrypt,
                    realDestViewKey, 0, this.rct);

            } catch (e) {
                console.log(e)

                //reject("Failed to create transaction: " + e);
                return false;
            }
            //console.log("signed tx: ", JSON.stringify(signed));
            //move some stuff here to normalize this.rct vs non
            var raw_tx_and_hash = {raw:null,hash:null,prvkey:null};
            if (signed.version === 1) {
                raw_tx_and_hash.raw = this.cnUtil.serialize_tx(signed,null);
                raw_tx_and_hash.hash = this.cnUtil.cn_fast_hash(this.raw_tx,null);
                raw_tx_and_hash.prvkey = signed.prvkey;
            } else {
                raw_tx_and_hash = this.cnUtil.serialize_rct_tx_with_hash(signed);
            }
            console.log("this.raw_tx and hash:");
            console.log(raw_tx_and_hash);
            //resolve(raw_tx_and_hash);
            return raw_tx_and_hash;
        }
checkUnspentOuts(outputs) {

for (var i = 0; i < outputs.length; i++) {

  for (var j = 0; outputs[i] && j < outputs[i].spend_key_images.length; j++) {

      let key_img = this.sApplication.openedWallet.cachedKeyImage(outputs[i].tx_pub_key, outputs[i].index);

      if (key_img === outputs[i].spend_key_images[j]) {
          console.log("Output was spent with key image: " + key_img + " amount: " + this.cnUtil.formatMoneyFull(outputs[i].amount));
          // Remove output from list
          outputs.splice(i, 1);
          if (outputs[i]) {
              j = outputs[i].spend_key_images.length;
          }
          i--;
      } else {

          console.log("Output used as mixin (" + key_img + "/" + outputs[i].spend_key_images[j] + ")");
      }
  }
}
console.log("Unspent outs: " + JSON.stringify(outputs));
return outputs;
}
parseOpenAliasRecord(record) {
    var parsed = {
        address:null,
        name:null,
        description:null
    };
    if (record.slice(0, 4 + this.sConfig.openAliasPrefix.length + 1) !== "oa1:" + this.sConfig.openAliasPrefix + " ") {
        throw "Invalid OpenAlias prefix";
    }


    parsed.address = this.parse_param('recipient_address',record);
    parsed.name = this.parse_param('recipient_name',record);
    parsed.description = this.parse_param('tx_description',record);
    return parsed;
}
parse_param(name,record) {
    var pos = record.indexOf(name + "=");
    if (pos === -1) {
        // Record does not contain param
        return undefined;
    }
    pos += name.length + 1;
    var pos2 = record.indexOf(";", pos);
    return record.substr(pos, pos2 - pos);
}
raw_tx:any;
transferSuccess(tx_h) {
  var prevFee = this.neededFee;
  this.raw_tx = tx_h.raw;
  var tx_hash = tx_h.hash;
  var tx_prvkey = tx_h.prvkey;
  // work out per-kb fee for transaction
  var txBlobBytes = this.raw_tx.length / 2;
  var txBlobKBytes = txBlobBytes / 1024.0;
  var numKB = Math.floor(txBlobKBytes);
  if (txBlobBytes % 1024) {
      numKB++;
  }
  let mess:any = txBlobBytes + " bytes <= " + numKB + " KB (current fee: " + this.cnUtil.formatMoneyFull(prevFee) + ")";
  console.log(mess);
  this.neededFee = this.feePerKB.multiply(numKB).multiply(this.fee_multiplayer);
  // if we need a higher fee
  if (this.neededFee.compare(prevFee) > 0) {
      console.log("Previous fee: " + this.cnUtil.formatMoneyFull(prevFee) + " New fee: " + this.cnUtil.formatMoneyFull(this.neededFee));
      this.transfer().then((result:any) => {
        this.transferSuccess(result);
      }, (err) => {
        this.transferFailure(err);
      });
      return;
  }

  // generated with correct per-kb fee
  console.log("Successful tx generation, submitting tx");
  this.presentLoadingDefault("Successful tx generation, submitting tx");
  console.log("Tx hash: " + tx_hash);
  this.status = "Submitting...";
  var request = {
      address: this.sApplication.openedWallet.getAddress(),
      view_key: this.sApplication.openedWallet.getViewKey(),
      tx: this.raw_tx
  };

  this.confirmTransfer(this.realDsts[0].address, this.realDsts[0].amount,
    tx_hash, this.neededFee, tx_prvkey, this.payment_id,
    this.mixin, this.priority, txBlobKBytes).then((result:any) => {

        let data:any = {
            address: this.sApplication.openedWallet.address,
            view_key: this.sApplication.openedWallet.viewKey,
            tx: this.raw_tx
        };
        data = JSON.stringify(data);
        var header = { "headers": {"Content-Type": "application/json;charset=UTF-8"} };
        this.http.post(this.sApplication.remotePath+'/submit_raw_tx', data, header).toPromise().then((response:any) =>
        {
            var data = response;

            if (data.status === "error")
            {
                this.status = "";
                this.submitting = false;
                this.error = "Something unexpected occurred when submitting your transaction: " + data.error;
                this.dismissLoadingDefault(this.error);
                return;
            }else {
                //console.log("Successfully submitted tx");
                this.targets = [{}];
                this.sent_tx = {
                    address: this.realDsts[0].address,
                    domain: this.realDsts[0].domain,
                    amount: this.realDsts[0].amount,
                    payment_id: this.payment_id,
                    tx_id: tx_hash,
                    tx_prvkey: tx_prvkey,
                    tx_fee: this.neededFee,//.add(getTxCharge(neededFee)),
                    explorerLink: "tx/" + tx_hash
                };
                this.dismissLoadingDefault("Transfer ok !");

                this.success_page = true;
                this.status = "";
                this.submitting = false;
            }
        })
        .catch((error) =>
        {
            this.status = "";
                  this.submitting = false;
                  this.error = "Something unexpected occurred when submitting your transaction: ";
                  this.dismissLoadingDefault(this.error);
            //reject(error);
        });
  }, (err) => {
    this.transferFailure("Transfer canceled");
  });
}


}
