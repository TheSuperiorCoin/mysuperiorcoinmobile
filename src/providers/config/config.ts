import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var JSBigInt;
@Injectable()
export class ConfigProvider {
  apiUrl = "https://mysuperiorcoin.com:1984/";
  mainnetExplorerUrl = "http://superior-coin.com:8081/";
  testnetExplorerUrl = "http://139.162.32.245:8082/";
  testnet = false;
  coinUnitPlaces = 8;
  txMinConfirms = 10;         // corresponds to CRYPTONOTE_DEFAULT_TX_SPENDABLE_AGE in Monero
  txCoinbaseMinConfirms = 60; // corresponds to CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW in Monero
  coinSymbol = 'SUP';
  openAliasPrefix = "sup";
  coinName = 'Superior';
  coinUriPrefix = 'superior:';
  addressPrefix = 26;
  integratedAddressPrefix = 27;
  addressPrefixTestnet = 70;
  integratedAddressPrefixTestnet = 57;
  feePerKB = 2000000000;//20^10 - for testnet its not used; as fee is dynamic.
  dustThreshold = 100000000;//10^10 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
  txChargeRatio = 0.5;
  defaultMixin = 4; // minimum mixin for hardfork v5
  txChargeAddress = '';
  idleTimeout = 30;
  idleWarningDuration = 20;
  maxBlockNumber = 500000000;
  avgBlockTime = 120;
  debugMode = false;
  coinUnits:any = new JSBigInt("100000000");
    
  constructor(public http: HttpClient) {
    
  }

}
