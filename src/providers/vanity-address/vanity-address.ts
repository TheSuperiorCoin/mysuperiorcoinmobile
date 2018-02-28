import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CnutilProvider } from '../cnutil/cnutil';
import { MnemonicProvider } from '../mnemonic/mnemonic';
import { ConfigProvider } from '../config/config';

/*
  Generated class for the VanityAddressProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VanityAddressProvider {
  running = false;
  num_searched = 0;
  found:any;
  seed:any;
  last_generated:any;
  bestMatch:any = 0;
  prefix:String;


  constructor(
    public http: HttpClient,
    public cnUtil:CnutilProvider,
    public mnemonic:MnemonicProvider,
    public config:ConfigProvider
  ) {
    this.prefix = this.config.addressPrefix.toString();
  }
  score(address, prefix) {
      address = address.toUpperCase();
      for (var i = 0; i < prefix.length; ++i) {
          if (address[i] !== prefix[i] && prefix[i] !== '*') return i;
      }
      return prefix.length;
  }

startGeneration(prefix) {
    this.found = {};
    this.num_searched = 0;
    this.seed = this.cnUtil.rand_16();

    this.bestMatch = 0;
    this.last_generated = 0;
    this.prefix = this.prefix.toUpperCase();
    return this.generateAddress();
    //setTimeout(this.generateAddress(), 0);
}

generateAddress() {
    console.log(this.seed);
  for (var i = 0; i < 10; ++i) {
      if (!this.running) return;
      var address = this.cnUtil.create_addr_prefix(this.seed);
      ++this.num_searched;
      console.log(address+' -'+this.prefix);
      var sc = this.score(address, this.prefix);
      
      if (sc === this.prefix.length) {
          console.log(sc+' === '+this.prefix.length);
          this.found = {
              mnemonic: this.mnemonic.mn_encode(this.seed,null),
              address: this.cnUtil.create_address(this.seed).public_addr
          };
          //this.num_searched = num_searched;
          this.running = false;
          break;
      } else {
        console.log(sc+' >= '+this.bestMatch);
          if (sc >= this.bestMatch) {
            this.bestMatch = sc;
              this.found = {
                  mnemonic: this.mnemonic.mn_encode(this.seed,null),
                  address: this.cnUtil.create_address(this.seed).public_addr
              };
          }
      }
      var lastByte;
      lastByte = parseInt(this.seed.slice(30, 32), 16);
      if (lastByte < 0xff) {
        this.seed = this.seed.slice(0, 30) + ('0' + (lastByte + 1).toString(16)).slice(-2);
      } else {
        this.seed = this.cnUtil.keccak(this.seed, 16, 32).slice(0, 30) + '00';
      }
  }

  if (this.num_searched - this.last_generated > 10000) {
      this.seed = this.cnUtil.rand_16();
      this.last_generated = this.num_searched;
  }

  //this.num_searched = this.num_searched;
  //this.$apply();
  //setTimeout(this.generateAddress(), 0);
  this.running = false;
  return this;
}
/*this.$on('$destroy', function () {
    this.running = false;
});*/

toggleGeneration() {
    this.running = !this.running;
    
    if (this.running) {
        if (!this.prefix) {
            this.running = false;
            
            return;
        }
        
        return this.startGeneration(this.prefix);
    }
}

}
