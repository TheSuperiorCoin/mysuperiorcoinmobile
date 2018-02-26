import { ConfigProvider } from "../providers/config/config";
import { CnutilProvider } from "../providers/cnutil/cnutil";

declare var JSBigInt;
export class AccountModel {
    constructor(
        public sConfig:ConfigProvider,
        public cnUtil:CnutilProvider
    ) {
  
    }
    /*
    balance = JSBigInt.ZERO;
    locked_balance = JSBigInt.ZERO;
    total_received = JSBigInt.ZERO;
    received_unlocked = JSBigInt.ZERO;
    total_received_unlocked = JSBigInt.ZERO;
    total_sent = JSBigInt.ZERO;
    address:any;
    view_key:any;
    view_only:any;
    spend_key:any;
    mnemonic:any;

    testnet:any;// = this.sConfig.testnet;

    transactions = [];
    blockchain_height = 0;
    tx_is_confirmed = function(tx) {
       // return (this.blockchain_height - tx.height) > this.sConfig.txMinConfirms;
        if (!tx.coinbase)
        {
            // for regular txs, by defalut 10 blocks is required for it to
            // be confirmed/spendable
            return (this.blockchain_height - tx.height) > this.sConfig.txMinConfirms;
        }
        else
        {
            // coinbase txs require much more blocks (default 60)
            // for it to be confirmed/spendable
            return (this.blockchain_height - tx.height) > this.sConfig.txCoinbaseMinConfirms;
        }
    };

    tx_is_unlocked = function(tx) {
        return this.cnUtil.is_tx_unlocked(tx.unlock_time || 0, this.blockchain_height);
        //return false;
    };

    tx_is_mempool = function(tx) {
        //console.log(tx.mempool);
        return tx.mempool;
    };

    tx_locked_reason = function(tx) {
        return this.cnUtil.tx_locked_reason(tx.unlock_time || 0, this.blockchain_height);
    };

    set_locked_balance = function(locked_balance) {
        this.locked_balance = locked_balance;
    };
    set_total_received = function(total_received) {
        this.total_received = total_received;
    };
    set_total_sent = function(total_sent) {
        this.total_sent = total_sent;
    };

    /*this.$on(EVENT_CODES.authStatusChanged, function() {
        this.address = AccountService.getAddress();
        this.view_key = this.viewkey = AccountService.getViewKey();
        this.spend_key = AccountService.getSpendKey();
        this.mnemonic = AccountService.getMnemonic();
        this.view_only = AccountService.isViewOnly();
        if (!AccountService.loggedIn()) {
            this.transactions = [];
            this.blockchain_height = 0;
            this.balance = JSBigInt.ZERO;
            this.locked_balance = JSBigInt.ZERO;
            this.total_received = JSBigInt.ZERO;
            this.total_received_unlocked = JSBigInt.ZERO;
            this.received_unlocked = JSBigInt.ZERO;
            this.total_sent = JSBigInt.ZERO;
        }
    });*

    fetchAddressInfo = function() {
        if (AccountService.loggedIn()) {
            ApiCalls.fetchAddressInfo(AccountService.getAddress(), AccountService.getViewKey())
                .then(function(response) {

                    var data = response.data;

                    var promises = [];

                    var view_only = AccountService.isViewOnly();

                    for (var i = 0; i < (data.spent_outputs || []).length; ++i)
                    {
                        var deferred = $q.defer();
                        promises.push(deferred.promise);

                        if (view_only === false)
                        {
                            (function(deferred, spent_output) {
                                setTimeout(function() {
                                    var key_image = AccountService.cachedKeyImage(
                                        spent_output.tx_pub_key,
                                        spent_output.out_index
                                    );
                                    if (spent_output.key_image !== key_image) {
                                        data.total_sent = new JSBigInt(data.total_sent).subtract(spent_output.amount);
                                    }
                                    deferred.resolve();
                                }, 0);
                            })(deferred, data.spent_outputs[i]);
                        }
                    }
                    $q.all(promises).then(function() {

                        var scanned_block_timestamp = data.scanned_block_timestamp || 0;

                        if (scanned_block_timestamp > 0)
                            scanned_block_timestamp = new Date(scanned_block_timestamp * 1000)


                        this.locked_balance = new JSBigInt(data.locked_funds || 0);
                        this.total_sent = new JSBigInt(data.total_sent || 0);
                        //this.account_scanned_tx_height = data.scanned_height || 0;
                        this.account_scanned_block_height = data.scanned_block_height || 0;
                        this.account_scanned_block_timestamp = scanned_block_timestamp;
                        this.account_scan_start_height = data.start_height || 0;
                        //this.transaction_height = data.transaction_height || 0;
                        this.blockchain_height = data.blockchain_height || 0;
                    });
            }, function(response) {
                    console.log(response)
                });
            }
    };

    fetchTransactions = function() {
            var view_only = false;//AccountService.isViewOnly();

            ApiCalls.get_address_txs(AccountService.getAddress(), AccountService.getViewKey())
                .then(function(response) {

                    var data = response.data;

                    var scanned_block_timestamp = data.scanned_block_timestamp || 0;

                    if (scanned_block_timestamp > 0)
                        scanned_block_timestamp = new Date(scanned_block_timestamp * 1000)

                    this.account_scanned_height = data.scanned_height || 0;
                    this.account_scanned_block_height = data.scanned_block_height || 0;
                    this.account_scanned_block_timestamp = scanned_block_timestamp;
                    this.account_scan_start_height = data.start_height || 0;
                    //this.transaction_height = data.transaction_height || 0;
                    this.blockchain_height = data.blockchain_height || 0;


                    var transactions = data.transactions || [];

                    for (var i = 0; i < transactions.length; ++i) {
                        if ((transactions[i].spent_outputs || []).length > 0)
                        {
                            if (view_only === false)
                            {
                                for (var j = 0; j < transactions[i].spent_outputs.length; ++j)
                                {
                                    var key_image = AccountService.cachedKeyImage(
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
                        }
                        //console.log(transactions[i].total_received, transactions[i].total_sent);


                        // decrypt payment_id8 which results in using
                        // integrated address
                        if (transactions[i].payment_id.length == 16) {
                            if (transactions[i].tx_pub_key) {
                                var decrypted_payment_id8
                                    = this.decrypt_payment_id(transactions[i].payment_id,
                                                        transactions[i].tx_pub_key,
                                                        AccountService.getViewKey());
                                //console.log("decrypted_payment_id8: " + decrypted_payment_id8);
                                transactions[i].payment_id = decrypted_payment_id8;
                            }
                        }


                        if (view_only === false)
                        {

                            if (new JSBigInt(transactions[i].total_received || 0).add(transactions[i].total_sent || 0).compare(0) <= 0)
                            {
                                transactions.splice(i, 1);
                                i--;
                                continue;
                            }


                            transactions[i].amount = new JSBigInt(transactions[i].total_received || 0)
                                .subtract(transactions[i].total_sent || 0).toString();
                        }
                        else
                        {
                            //remove tx if zero xmr recievied. probably spent only tx,
                            //but we dont have spendkey to verify this.
                            //console.log(new JSBigInt(transactions[i].total_received));
                            //console.log(new JSBigInt(transactions[i].total_received).compare(0));
                            if (new JSBigInt(transactions[i].total_received).compare(0) <= 0)
                            {
                                transactions.splice(i, 1);
                                i--;
                                continue;
                            }
                            transactions[i].amount = new JSBigInt(transactions[i].total_received).toString();

                        }

                        transactions[i].approx_float_amount = parseFloat(this.cnUtil.formatMoney(transactions[i].amount));
                        transactions[i].timestamp = new Date(transactions[i].timestamp * 1000);
                    }

                    transactions.sort(function(a, b)
                    {
                        return b.id - a.id; // sort by id in database

                        //var t1 = b.timestamp;
                        //var t2 = a.timestamp;

                        //return ((t1 < t2) ? -1 : ((t1 > t2) ? 1 : 0));
                    });
                    this.transactions = transactions;
                    this.total_received = new JSBigInt(data.total_received || 0);
                    this.total_received_unlocked = new JSBigInt(data.total_received_unlocked || 0);
                }, function(response){
                    console.log("error")
                });
        
    };

    isAccountCatchingUp = function() {
        return (this.blockchain_height - this.account_scanned_block_height) >= 10;
    };

    this.$watch(
        function(scope) {
            return {
                sent: scope.total_sent,
                received: scope.total_received,
                received_unlocked: scope.total_received_unlocked
            };
        },
        function(data) {
            this.balance = data.received.subtract(data.sent);
            this.balance_unlocked = data.received_unlocked.subtract(data.sent);
        },
        true
    );
*/

}
