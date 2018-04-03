import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MnemonicProvider } from '../mnemonic/mnemonic';
import { NaclProvider } from '../nacl/nacl';
import { ConfigProvider } from '../config/config';
import { Base58Provider } from '../base58/base58';
//import { BigIntegerProvider } from '../big-integer/big-integer';
import moment from 'moment';
import keccak256 from 'js-sha3';

declare var Module;
declare var JSBigInt;
@Injectable()
export class CnutilProvider {
    HASH_STATE_BYTES = 200;
    HASH_SIZE = 32;
    CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX:any;
    CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX:any;
    ADDRESS_CHECKSUM_SIZE = 4;
    INTEGRATED_ID_SIZE = 8;
    ENCRYPTED_PAYMENT_ID_TAIL = 141;
    RCTTypeFull = 1;
    RCTTypeSimple = 2;
    H = "8b655970153799af2aeadc9ff1add0ea6c7251d54154cfa92c173a0dd39c1f94"; //base H for amounts
    l = "7237005577332262213973186563042994240857116359379907606001950938285454250989"; //curve order (not RCT specific)
    I = "0100000000000000000000000000000000000000000000000000000000000000"; //identity element
    Z = "0000000000000000000000000000000000000000000000000000000000000000"; //zero scalar
    TX_EXTRA_NONCE_MAX_COUNT = 255;
    TX_EXTRA_TAGS = {
        PADDING: '00',
        PUBKEY: '01',
        NONCE: '02',
        MERGE_MINING: '03'
    };
    TX_EXTRA_NONCE_TAGS = {
        PAYMENT_ID: '00',
        ENCRYPTED_PAYMENT_ID: '01'
    };
    KEY_SIZE = 32;
    STRUCT_SIZES = {
        GE_P3: 160,
        GE_P2: 120,
        GE_P1P1: 160,
        GE_CACHED: 160,
        EC_SCALAR: 32,
        EC_POINT: 32,
        KEY_IMAGE: 32,
        GE_DSMP: 160 * 8, // ge_cached * 8
        SIGNATURE: 64 // ec_scalar * 2
    };
    UINT64_MAX = Math.pow(2, 64);//JSBigInt(2).pow(64);
    CURRENT_TX_VERSION = 2;
    OLD_TX_VERSION = 1;
  
    H2 = ["8b655970153799af2aeadc9ff1add0ea6c7251d54154cfa92c173a0dd39c1f94", "8faa448ae4b3e2bb3d4d130909f55fcd79711c1c83cdbccadd42cbe1515e8712",
      "12a7d62c7791654a57f3e67694ed50b49a7d9e3fc1e4c7a0bde29d187e9cc71d", "789ab9934b49c4f9e6785c6d57a498b3ead443f04f13df110c5427b4f214c739",
      "771e9299d94f02ac72e38e44de568ac1dcb2edc6edb61f83ca418e1077ce3de8", "73b96db43039819bdaf5680e5c32d741488884d18d93866d4074a849182a8a64",
      "8d458e1c2f68ebebccd2fd5d379f5e58f8134df3e0e88cad3d46701063a8d412", "09551edbe494418e81284455d64b35ee8ac093068a5f161fa6637559177ef404",
      "d05a8866f4df8cee1e268b1d23a4c58c92e760309786cdac0feda1d247a9c9a7", "55cdaad518bd871dd1eb7bc7023e1dc0fdf3339864f88fdd2de269fe9ee1832d",
      "e7697e951a98cfd5712b84bbe5f34ed733e9473fcb68eda66e3788df1958c306", "f92a970bae72782989bfc83adfaa92a4f49c7e95918b3bba3cdc7fe88acc8d47",
      "1f66c2d491d75af915c8db6a6d1cb0cd4f7ddcd5e63d3ba9b83c866c39ef3a2b", "3eec9884b43f58e93ef8deea260004efea2a46344fc5965b1a7dd5d18997efa7",
      "b29f8f0ccb96977fe777d489d6be9e7ebc19c409b5103568f277611d7ea84894", "56b1f51265b9559876d58d249d0c146d69a103636699874d3f90473550fe3f2c",
      "1d7a36575e22f5d139ff9cc510fa138505576b63815a94e4b012bfd457caaada", "d0ac507a864ecd0593fa67be7d23134392d00e4007e2534878d9b242e10d7620",
      "f6c6840b9cf145bb2dccf86e940be0fc098e32e31099d56f7fe087bd5deb5094", "28831a3340070eb1db87c12e05980d5f33e9ef90f83a4817c9f4a0a33227e197",
      "87632273d629ccb7e1ed1a768fa2ebd51760f32e1c0b867a5d368d5271055c6e", "5c7b29424347964d04275517c5ae14b6b5ea2798b573fc94e6e44a5321600cfb",
      "e6945042d78bc2c3bd6ec58c511a9fe859c0ad63fde494f5039e0e8232612bd5", "36d56907e2ec745db6e54f0b2e1b2300abcb422e712da588a40d3f1ebbbe02f6",
      "34db6ee4d0608e5f783650495a3b2f5273c5134e5284e4fdf96627bb16e31e6b", "8e7659fb45a3787d674ae86731faa2538ec0fdf442ab26e9c791fada089467e9",
      "3006cf198b24f31bb4c7e6346000abc701e827cfbb5df52dcfa42e9ca9ff0802", "f5fd403cb6e8be21472e377ffd805a8c6083ea4803b8485389cc3ebc215f002a",
      "3731b260eb3f9482e45f1c3f3b9dcf834b75e6eef8c40f461ea27e8b6ed9473d", "9f9dab09c3f5e42855c2de971b659328a2dbc454845f396ffc053f0bb192f8c3",
      "5e055d25f85fdb98f273e4afe08464c003b70f1ef0677bb5e25706400be620a5", "868bcf3679cb6b500b94418c0b8925f9865530303ae4e4b262591865666a4590",
      "b3db6bd3897afbd1df3f9644ab21c8050e1f0038a52f7ca95ac0c3de7558cb7a", "8119b3a059ff2cac483e69bcd41d6d27149447914288bbeaee3413e6dcc6d1eb",
      "10fc58f35fc7fe7ae875524bb5850003005b7f978c0c65e2a965464b6d00819c", "5acd94eb3c578379c1ea58a343ec4fcff962776fe35521e475a0e06d887b2db9",
      "33daf3a214d6e0d42d2300a7b44b39290db8989b427974cd865db011055a2901", "cfc6572f29afd164a494e64e6f1aeb820c3e7da355144e5124a391d06e9f95ea",
      "d5312a4b0ef615a331f6352c2ed21dac9e7c36398b939aec901c257f6cbc9e8e", "551d67fefc7b5b9f9fdbf6af57c96c8a74d7e45a002078a7b5ba45c6fde93e33",
      "d50ac7bd5ca593c656928f38428017fc7ba502854c43d8414950e96ecb405dc3", "0773e18ea1be44fe1a97e239573cfae3e4e95ef9aa9faabeac1274d3ad261604",
      "e9af0e7ca89330d2b8615d1b4137ca617e21297f2f0ded8e31b7d2ead8714660", "7b124583097f1029a0c74191fe7378c9105acc706695ed1493bb76034226a57b",
      "ec40057b995476650b3db98e9db75738a8cd2f94d863b906150c56aac19caa6b", "01d9ff729efd39d83784c0fe59c4ae81a67034cb53c943fb818b9d8ae7fc33e5",
      "00dfb3c696328c76424519a7befe8e0f6c76f947b52767916d24823f735baf2e", "461b799b4d9ceea8d580dcb76d11150d535e1639d16003c3fb7e9d1fd13083a8",
      "ee03039479e5228fdc551cbde7079d3412ea186a517ccc63e46e9fcce4fe3a6c", "a8cfb543524e7f02b9f045acd543c21c373b4c9b98ac20cec417a6ddb5744e94",
      "932b794bf89c6edaf5d0650c7c4bad9242b25626e37ead5aa75ec8c64e09dd4f", "16b10c779ce5cfef59c7710d2e68441ea6facb68e9b5f7d533ae0bb78e28bf57",
      "0f77c76743e7396f9910139f4937d837ae54e21038ac5c0b3fd6ef171a28a7e4", "d7e574b7b952f293e80dde905eb509373f3f6cd109a02208b3c1e924080a20ca",
      "45666f8c381e3da675563ff8ba23f83bfac30c34abdde6e5c0975ef9fd700cb9", "b24612e454607eb1aba447f816d1a4551ef95fa7247fb7c1f503020a7177f0dd",
      "7e208861856da42c8bb46a7567f8121362d9fb2496f131a4aa9017cf366cdfce", "5b646bff6ad1100165037a055601ea02358c0f41050f9dfe3c95dccbd3087be0",
      "746d1dccfed2f0ff1e13c51e2d50d5324375fbd5bf7ca82a8931828d801d43ab", "cb98110d4a6bb97d22feadbc6c0d8930c5f8fc508b2fc5b35328d26b88db19ae",
      "60b626a033b55f27d7676c4095eababc7a2c7ede2624b472e97f64f96b8cfc0e", "e5b52bc927468df71893eb8197ef820cf76cb0aaf6e8e4fe93ad62d803983104",
      "056541ae5da9961be2b0a5e895e5c5ba153cbb62dd561a427bad0ffd41923199", "f8fef05a3fa5c9f3eba41638b247b711a99f960fe73aa2f90136aeb20329b888"];


  constructor(
    public http: HttpClient,
    public sMnemonic: MnemonicProvider,
    public config:ConfigProvider,
    public sNacl:NaclProvider,
    public cnBase: Base58Provider,
    /*public bigInt:BigIntegerProvider*/
  ) {
    this.init();
  }
  init(){

  /*let this.config:any = {};// shallow copy of initthis.config

  for (let key in this.sthis.config.initthis.config) {
      this.config[key] = this.sthis.config.initthis.config[key];
  }*/

  //this.config.coinUnits = JSBigInt(10).pow(this.config.coinUnitPlaces);

  
  
  
  this.CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = this.config.addressPrefix;
  this.CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = this.config.integratedAddressPrefix;
  if (this.config.testnet === true)
  {
    this.CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = this.config.addressPrefixTestnet;
    this.CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = this.config.integratedAddressPrefixTestnet;
  }

}
  
  //begin rct new functions
  //creates a Pedersen commitment from an amount (in scalar form) and a mask
  //C = bG + aH where b = mask, a = amount
  commit(amount, mask){

      if (!this.valid_hex(mask) || mask.length !== 64 || !this.valid_hex(amount) || amount.length !== 64){
          throw "invalid amount or mask!";
      }
      let C = this.ge_double_scalarmult_base_vartime(amount, this.H, mask);
      return C;
  }

  zeroCommit(amount){
      if (!!this.valid_hex(amount) || amount.length !== 64){
          throw "invalid amount!";
      }
      let C = this.ge_double_scalarmult_base_vartime(amount, this.H, this.I);
      return C;
  }

  decode_rct_ecdh (ecdh, key) {
      let first = this.hash_to_scalar(key);
      let second = this.hash_to_scalar(first);
      return {
          "mask": this.sc_sub(ecdh.mask, first),
          "amount": this.sc_sub(ecdh.amount, second)
      };
  };

  encode_rct_ecdh (ecdh, key) {
      let first = this.hash_to_scalar(key);
      let second = this.hash_to_scalar(first);
      return {
          "mask": this.sc_add(ecdh.mask, first),
          "amount": this.sc_add(ecdh.amount, second)
      };
  };

  //switch byte order for hex string
  swapEndian(hex){
      if (hex.length % 2 !== 0){return "length must be a multiple of 2!";}
      let data = "";
      for (let i=1; i <= hex.length / 2; i++){
          data += hex.substr(0 - 2 * i, 2);
      }
      return data;
  }

  //switch byte order charwise
  swapEndianC(string){
      let data = "";
      for (let i=1; i <= string.length; i++){
          data += string.substr(0 - i, 1);
      }
      return data;
  }

  //for most uses you'll also want to swapEndian after conversion
  //mainly to convert integer "scalars" to usable hexadecimal strings
  d2h(integer){
      if (typeof integer !== "string" && integer.toString().length > 15){throw "integer should be entered as a string for precision";}
      let padding = "";
      for (let i = 0; i < 63; i++){
          padding += "0";
      }
      return (padding + JSBigInt(integer, null).toString(16).toLowerCase()).slice(-64);
  }

  //integer (string) to scalar
  d2s(integer){
      return this.swapEndian(this.d2h(integer));
  }

  //scalar to integer (string)
  s2d(scalar){
      return JSBigInt.parse(this.swapEndian(scalar), 16).toString();
  }

  //convert integer string to 64bit "binary" little-endian string
  d2b(integer){
      if (typeof integer !== "string" && integer.toString().length > 15){throw "integer should be entered as a string for precision";}
      let padding = "";
      for (let i = 0; i < 63; i++){
          padding += "0";
      }
      let a = JSBigInt(integer, null);
      if (a.toString(2).length > 64){throw "amount overflows uint64!";}
      return this.swapEndianC((padding + a.toString(2)).slice(-64));
  }

  //convert integer string to 64bit base 4 little-endian string
  d2b4(integer){
      if (typeof integer !== "string" && integer.toString().length > 15){throw "integer should be entered as a string for precision";}
      let padding = "";
      for (let i = 0; i < 31; i++){
          padding += "0";
      }
      let a = JSBigInt(integer, null);
      if (a.toString(2).length > 64){throw "amount overflows uint64!";}
      return this.swapEndianC((padding + a.toString(4)).slice(-32));
  }
  //end rct new functions

  valid_hex (hex) {
      let exp = new RegExp("[0-9a-fA-F]{" + hex.length + "}");
      return exp.test(hex);
  };

  //simple exclusive or for two hex inputs
  hex_xor (hex1, hex2) {
      if (!hex1 || !hex2 || hex1.length !== hex2.length || hex1.length % 2 !== 0 || hex2.length % 2 !== 0){throw "Hex string(s) is/are invalid!";}
      let bin1 = this.hextobin(hex1);
      let bin2 = this.hextobin(hex2);
      let xor = new Uint8Array(bin1.length);
      for (let i = 0; i < xor.length; i++){
          xor[i] = bin1[i] ^ bin2[i];
      }
      return this.bintohex(xor);
  };

  hextobin(hex) {
      if (hex.length % 2 !== 0) throw "Hex string has invalid length!";
      let res = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length / 2; ++i) {
          res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      }
      return res;
  }

  bintohex(bin) {
      let out = [];
      for (let i = 0; i < bin.length; ++i) {
          out.push(("0" + bin[i].toString(16)).slice(-2));
      }
      return out.join("");
  }

  // Generate a 256-bit crypto random
  rand_32 () {
      return this.sMnemonic.mn_random(256);
  };

  // Generate a 128-bit crypto random
  rand_16 () {
      return this.sMnemonic.mn_random(128);
  };

  // Generate a 64-bit crypto random
  rand_8 () {
      return this.sMnemonic.mn_random(64);
  };    

  encode_letint (i) {

      i = JSBigInt(i,null);
        //console.log(i);
      let out = '';
      let index:any = 0;
      // While i >= b10000000
      while (i.compare(0x80) >= 0) {
        //console.log(i.compare(0x80)+' >= 0');
          // out.append i & b01111111 | b10000000
          out += ("0" + ((i.lowVal() & 0x7f) | 0x80).toString(16)).slice(-2);
          let t:any = JSBigInt(2,null).pow(7);
        

          let div:any = i.quotient(t);
          i = div;
         
          index++;
          //if(index>10) break;
      }
      
      out += ("0" + i.toJSValue().toString(16)).slice(-2);
      return out;
  };

  sc_reduce (hex) {
      let input = this.hextobin(hex);
      if (input.length !== 64) {
          throw "Invalid input length";
      }
      let mem = Module._malloc(64);
      Module.HEAPU8.set(input, mem);
      Module.ccall('sc_reduce', 'void', ['number'], [mem]);
      let output = Module.HEAPU8.subarray(mem, mem + 64);
      Module._free(mem);
      return this.bintohex(output);
  };

  sc_reduce32 (hex) {
      let input = this.hextobin(hex);
      if (input.length !== 32) {
          throw "Invalid input length";
      }
      let mem = Module._malloc(32);
      Module.HEAPU8.set(input, mem);
      Module.ccall('sc_reduce32', 'void', ['number'], [mem]);
      let output = Module.HEAPU8.subarray(mem, mem + 32);
      Module._free(mem);
      return this.bintohex(output);

  };

  cn_fast_hash (input, inlen) {
      if (inlen === null || !inlen) {
          inlen = Math.floor(input.length / 2);
      }
      if (input.length % 2 !== 0 || !this.valid_hex(input)) {
          throw "Input invalid";
      }
      //update to use new keccak impl (approx 45x faster)
      /*let state = this.keccak(input, inlen, this.HASH_STATE_BYTES);
      return state.substr(0, this.HASH_SIZE * 2);*/
      let v:any = keccak256.keccak256(this.hextobin(input));
      return v;
  };



  sec_key_to_pub (sec) {
      if (sec.length !== 64) {
          throw "Invalid sec length";
      }
     
      return this.bintohex(this.sNacl.ge_scalarmult_base(this.hextobin(sec)));
  };

  //alias
  ge_scalarmult_base (sec) {
      return this.sec_key_to_pub(sec);
  };


  ge_scalarmult (pub, sec) {

      if (pub.length !== 64 || sec.length !== 64) {
          throw "Invalid input length";
      }
      let hex1 = this.hextobin(pub);
      let hex2 = this.hextobin(sec);

      let gesc = this.sNacl.ge_scalarmult(hex1,hex2);

      let sc = this.bintohex(gesc);
      return sc;
  };

  pubkeys_to_string (spend, view) {
      let prefix = this.encode_letint(this.CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX);
      let data = prefix + spend + view;
      let checksum = this.cn_fast_hash(data,null);
      return this.cnBase.encode(data + checksum.slice(0, this.ADDRESS_CHECKSUM_SIZE * 2));
  };

  get_account_integrated_address (address, payment_id8) {
      let decoded_address = this.decode_address(address);

      let prefix = this.encode_letint(this.CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX);        
      let data = prefix + decoded_address.spend  + decoded_address.view + payment_id8;    

      let checksum = this.cn_fast_hash(data,null);

      return this.cnBase.encode(data + checksum.slice(0, this.ADDRESS_CHECKSUM_SIZE * 2));
  };    


  decrypt_payment_id (payment_id8, tx_public_key, acc_prv_view_key) {
      if (payment_id8.length !== 16) throw "Invalid input length!";  

      let key_derivation = this.generate_key_derivation(tx_public_key, acc_prv_view_key);    

      let pid_key = this.cn_fast_hash(key_derivation + this.ENCRYPTED_PAYMENT_ID_TAIL.toString(16),null).slice(0, this.INTEGRATED_ID_SIZE * 2);

      let decrypted_payment_id = this.hex_xor(payment_id8, pid_key);

      return decrypted_payment_id;
  }

  // Generate keypair from seed
  generate_keys_old (seed) {
      if (seed.length !== 64) throw "Invalid input length!";
      let sec = this.sc_reduce32(seed);
      let pub = this.sec_key_to_pub(sec);
      return {
          'sec': sec,
          'pub': pub
      };
  };

  // Generate keypair from seed 2
  // as in simplewallet
  generate_keys (seed) {
      if (seed.length !== 64) throw "Invalid input length!";
      let sec = this.sc_reduce32(seed);
      let pub = this.sec_key_to_pub(sec);

      return {
          'sec': sec,
          'pub': pub
      };
  };

  random_keypair () {
      return this.generate_keys(this.rand_32());
  };

  // Random 32-byte ec scalar
  random_scalar () {
      //let rand = this.sc_reduce(mn_random(64 * 8));
      //return rand.slice(0, STRUCT_SIZES.EC_SCALAR * 2);
      return this.sc_reduce32(this.rand_32());
  };

  keccak (hex, inlen, outlen) {
      let input = this.hextobin(hex);
      if (input.length !== inlen) {
          throw "Invalid input length";
      }
      if (outlen <= 0) {
          throw "Invalid output length";
      }
      let input_mem = Module._malloc(inlen);
      Module.HEAPU8.set(input, input_mem);
      let out_mem = Module._malloc(outlen);
      Module._keccak(input_mem, inlen | 0, out_mem, outlen | 0);
      let output = Module.HEAPU8.subarray(out_mem, out_mem + outlen);
      Module._free(input_mem);
      Module._free(out_mem);
      return this.bintohex(output);
  }


  create_address (seed) {
      let keys:any = {};
      let first;
      if (seed.length !== 64) {
        
          first = this.cn_fast_hash(seed, null);
      } else {
          first = seed; //only input reduced seeds or this will not give you the result you want
      }

      keys.spend = this.generate_keys(first);
      let second:any;
      if (seed.length !== 64) {
        second = this.cn_fast_hash(first, null);
      } else {
         second = this.cn_fast_hash(keys.spend.sec, null);
      }

      keys.view = this.generate_keys(second);
      keys.public_addr = this.pubkeys_to_string(keys.spend.pub, keys.view.pub);
      return keys;
  }

  create_addr_prefix (seed) {
      let first;
      if (seed.length !== 64) {
          first = this.cn_fast_hash(seed,null);
      } else {
          first = seed;
      }
  
      let spend = this.generate_keys(first);
      let prefix = this.encode_letint(this.CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX);
      let v:any = this.cnBase.encode(prefix + spend.pub).slice(0, 44);
   
      return v;
  };
  
  decode_address (address) {
      let dec = this.cnBase.decode(address);
      let expectedPrefix = this.encode_letint(this.CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX);
      let expectedPrefixInt = this.encode_letint(this.CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX);
      let prefix = dec.slice(0, expectedPrefix.length);
      if (prefix !== expectedPrefix && prefix !== expectedPrefixInt) {
          throw "Invalid address prefix";
      }
      dec = dec.slice(expectedPrefix.length);
      let spend = dec.slice(0, 64);
      let view = dec.slice(64, 128);
      let checksum:any;
      let expectedChecksum:any;
      let intPaymentId:any = false;
      if (prefix === expectedPrefixInt){
        intPaymentId = dec.slice(128, 128 + (this.INTEGRATED_ID_SIZE * 2));
          checksum = dec.slice(128 + (this.INTEGRATED_ID_SIZE * 2), 128 + (this.INTEGRATED_ID_SIZE * 2) + (this.ADDRESS_CHECKSUM_SIZE * 2));
          expectedChecksum = this.cn_fast_hash(prefix + spend + view + intPaymentId, null).slice(0, this.ADDRESS_CHECKSUM_SIZE * 2);
      } else {
          checksum = dec.slice(128, 128 + (this.ADDRESS_CHECKSUM_SIZE * 2));
          expectedChecksum = this.cn_fast_hash(prefix + spend + view, null).slice(0, this.ADDRESS_CHECKSUM_SIZE * 2);
      }
      if (checksum !== expectedChecksum) {
          throw "Invalid checksum";
      }
      if (intPaymentId){
          return {
              spend: spend,
              view: view,
              intPaymentId: intPaymentId
          };
      } else {
          return {
              spend: spend,
              view: view,
              intPaymentId: null
          };
      }
  };

  valid_keys (view_pub, view_sec, spend_pub, spend_sec) {
      let expected_view_pub = this.sec_key_to_pub(view_sec);
      let expected_spend_pub = this.sec_key_to_pub(spend_sec);
      return (expected_spend_pub === spend_pub) && (expected_view_pub === view_pub);
  };

  hash_to_scalar (buf) {
      let hash = this.cn_fast_hash(buf, null);
      let scalar = this.sc_reduce32(hash);
      return scalar;
  };


  generate_key_derivation (pub, sec) {
      if (pub.length !== 64 || sec.length !== 64) {
          throw "Invalid input length";
      }

      let P = this.ge_scalarmult(pub, sec);

      return this.ge_scalarmult(P, this.d2s(8)); //mul8 to ensure group
  };

  derivation_to_scalar (derivation, output_index) {
      let buf = "";
      if (derivation.length !== (this.STRUCT_SIZES.EC_POINT * 2)) {
          throw "Invalid derivation length!";
      }
      buf += derivation;
      let enc = this.encode_letint(output_index);
      if (enc.length > 10 * 2) {
          throw "output_index didn't fit in 64-bit letint";
      }
      buf += enc;
      return this.hash_to_scalar(buf);
  };

  derive_secret_key (derivation, out_index, sec) {
      if (derivation.length !== 64 || sec.length !== 64) {
          throw "Invalid input length!";
      }
      let scalar_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      let scalar_b = this.hextobin(this.derivation_to_scalar(derivation, out_index));
      Module.HEAPU8.set(scalar_b, scalar_m);
      let base_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(this.hextobin(sec), base_m);
      let derived_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      Module.ccall("sc_add", "void", ["number", "number", "number"], [derived_m, base_m, scalar_m]);
      let res = Module.HEAPU8.subarray(derived_m, derived_m + this.STRUCT_SIZES.EC_SCALAR);
      Module._free(scalar_m);
      Module._free(base_m);
      Module._free(derived_m);
      return this.bintohex(res);
  };

  derive_public_key (derivation, out_index, pub) {
      if (derivation.length !== 64 || pub.length !== 64) {
          throw "Invalid input length!";
      }
      let s = this.derivation_to_scalar(derivation, out_index);
      return this.bintohex(this.sNacl.ge_add(this.hextobin(pub), this.hextobin(this.ge_scalarmult_base(s))));
  };

  hash_to_ec (key) {
      if (key.length !== (this.KEY_SIZE * 2)) {
          throw "Invalid input length";
      }
      let h_m = Module._malloc(this.HASH_SIZE);
      let point_m = Module._malloc(this.STRUCT_SIZES.GE_P2);
      let point2_m = Module._malloc(this.STRUCT_SIZES.GE_P1P1);
      let res_m = Module._malloc(this.STRUCT_SIZES.GE_P3);
      let hash = this.hextobin(this.cn_fast_hash(key, this.KEY_SIZE));
      Module.HEAPU8.set(hash, h_m);
      Module.ccall("ge_fromfe_frombytes_vartime", "void", ["number", "number"], [point_m, h_m]);
      Module.ccall("ge_mul8", "void", ["number", "number"], [point2_m, point_m]);
      Module.ccall("ge_p1p1_to_p3", "void", ["number", "number"], [res_m, point2_m]);
      let res = Module.HEAPU8.subarray(res_m, res_m + this.STRUCT_SIZES.GE_P3);
      Module._free(h_m);
      Module._free(point_m);
      Module._free(point2_m);
      Module._free(res_m);
      return this.bintohex(res);
  };

  //returns a 32 byte point via "ge_p3_tobytes" rather than a 160 byte "p3", otherwise same as above;
  hash_to_ec_2 (key) {
      if (key.length !== (this.KEY_SIZE * 2)) {
          throw "Invalid input length";
      }
      let h_m = Module._malloc(this.HASH_SIZE);
      let point_m = Module._malloc(this.STRUCT_SIZES.GE_P2);
      let point2_m = Module._malloc(this.STRUCT_SIZES.GE_P1P1);
      let res_m = Module._malloc(this.STRUCT_SIZES.GE_P3);
      let hash = this.hextobin(this.cn_fast_hash(key, this.KEY_SIZE));
      let res2_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(hash, h_m);
      Module.ccall("ge_fromfe_frombytes_vartime", "void", ["number", "number"], [point_m, h_m]);
      Module.ccall("ge_mul8", "void", ["number", "number"], [point2_m, point_m]);
      Module.ccall("ge_p1p1_to_p3", "void", ["number", "number"], [res_m, point2_m]);
      Module.ccall("ge_p3_tobytes", "void", ["number", "number"], [res2_m, res_m]);
      let res = Module.HEAPU8.subarray(res2_m, res2_m + this.KEY_SIZE);
      Module._free(h_m);
      Module._free(point_m);
      Module._free(point2_m);
      Module._free(res_m);
      Module._free(res2_m);
      return this.bintohex(res);
  }

  generate_key_image_2 (pub, sec) {
      if (!pub || !sec || pub.length !== 64 || sec.length !== 64) {
          throw "Invalid input length";
      }
      let pub_m = Module._malloc(this.KEY_SIZE);
      let sec_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(this.hextobin(pub), pub_m);
      Module.HEAPU8.set(this.hextobin(sec), sec_m);
      if (Module.ccall("sc_check", "number", ["number"], [sec_m]) !== 0) {
          throw "sc_check(sec) != 0";
      }
      let point_m = Module._malloc(this.STRUCT_SIZES.GE_P3);
      let point2_m = Module._malloc(this.STRUCT_SIZES.GE_P2);
      let point_b = this.hextobin(this.hash_to_ec(pub));
      Module.HEAPU8.set(point_b, point_m);
      let image_m = Module._malloc(this.STRUCT_SIZES.KEY_IMAGE);
      Module.ccall("ge_scalarmult", "void", ["number", "number", "number"], [point2_m, sec_m, point_m]);
      Module.ccall("ge_tobytes", "void", ["number", "number"], [image_m, point2_m]);
      let res = Module.HEAPU8.subarray(image_m, image_m + this.STRUCT_SIZES.KEY_IMAGE);
      Module._free(pub_m);
      Module._free(sec_m);
      Module._free(point_m);
      Module._free(point2_m);
      Module._free(image_m);
      return this.bintohex(res);
  };

  generate_key_image (tx_pub, view_sec, spend_pub, spend_sec, output_index) {
      if (tx_pub.length !== 64) {
          throw "Invalid tx_pub length";
      }
      if (view_sec.length !== 64) {
          throw "Invalid view_sec length";
      }
      if (spend_pub.length !== 64) {
          throw "Invalid spend_pub length";
      }
      if (spend_sec.length !== 64) {
          throw "Invalid spend_sec length";
      }
      let recv_derivation = this.generate_key_derivation(tx_pub, view_sec);
      let ephemeral_pub = this.derive_public_key(recv_derivation, output_index, spend_pub);

      let ephemeral_sec = this.derive_secret_key(recv_derivation, output_index, spend_sec);

      let k_image = this.generate_key_image_2(ephemeral_pub, ephemeral_sec);

      return {
          ephemeral_pub: ephemeral_pub,
          key_image: k_image
      };
  }

  generate_key_image_helper_rct (keys, tx_pub_key, out_index, enc_mask) {
      let recv_derivation = this.generate_key_derivation(tx_pub_key, keys.view.sec);
      if (!recv_derivation) throw "Failed to generate key image";

      let mask;

      if (enc_mask === this.I)
      {
          // this is for ringct coinbase txs (rct type 0). they are ringct tx that have identity mask
          mask = enc_mask; // enc_mask is idenity mask returned by backend.
      }
      else
      {
          // for other ringct types or for non-ringct txs to this.
          mask = enc_mask ? this.sc_sub(enc_mask, this.hash_to_scalar(this.derivation_to_scalar(recv_derivation, out_index))) : this.I; //decode mask, or d2s(1) if no mask
      }

      let ephemeral_pub = this.derive_public_key(recv_derivation, out_index, keys.spend.pub);
      if (!ephemeral_pub) throw "Failed to generate key image";
      let ephemeral_sec = this.derive_secret_key(recv_derivation, out_index, keys.spend.sec);
      let image = this.generate_key_image_2(ephemeral_pub, ephemeral_sec);
      return {
          in_ephemeral: {
              pub: ephemeral_pub,
              sec: ephemeral_sec,
              mask: mask
          },
          image: image
      };
  };

  //curve and scalar functions; split out to make their host functions cleaner and more readable
  //inverts X coordinate -- this seems correct ^_^ -luigi1111
  ge_neg (point) {
    if (point.length !== 64){
      throw "expected 64 char hex string";
    }
    return point.slice(0,62) + ((parseInt(point.slice(62,63), 16) + 8) % 16).toString(16) + point.slice(63,64);
  };

  //adds two points together, order does not matter
  /*this.ge_add2 (point1, point2) {
      let point1_m = Module._malloc(this.KEY_SIZE);
      let point2_m = Module._malloc(this.KEY_SIZE);
      let point1_m2 = Module._malloc(STRUCT_SIZES.GE_P3);
      let point2_m2 = Module._malloc(STRUCT_SIZES.GE_P3);
      Module.HEAPU8.set(this.hextobin(point1), point1_m);
      Module.HEAPU8.set(this.hextobin(point2), point2_m);
      if (Module.ccall("ge_frombytes_vartime", "bool", ["number", "number"], [point1_m2, point1_m]) !== 0) {
          throw "ge_frombytes_vartime returned non-zero error code";
      }
      if (Module.ccall("ge_frombytes_vartime", "bool", ["number", "number"], [point2_m2, point2_m]) !== 0) {
          throw "ge_frombytes_vartime returned non-zero error code";
      }
      let sum_m = Module._malloc(this.KEY_SIZE);
      let p2_m = Module._malloc(STRUCT_SIZES.GE_P2);
      let p1_m = Module._malloc(STRUCT_SIZES.GE_P1P1);
      let p3_m = Module._malloc(STRUCT_SIZES.GE_CACHED);
      Module.ccall("ge_p3_to_cached", "void", ["number", "number"], [p3_m, point2_m2]);
      Module.ccall("ge_add", "void", ["number", "number", "number"], [p1_m, point1_m2, p3_m]);
      Module.ccall("ge_p1p1_to_p2", "void", ["number", "number"], [p2_m, p1_m]);
      Module.ccall("ge_tobytes", "void", ["number", "number"], [sum_m, p2_m]);
      let res = Module.HEAPU8.subarray(sum_m, sum_m + this.KEY_SIZE);
      Module._free(point1_m);
      Module._free(point1_m2);
      Module._free(point2_m);
      Module._free(point2_m2);
      Module._free(p2_m);
      Module._free(p1_m);
      Module._free(sum_m);
      Module._free(p3_m);
      return this.bintohex(res);
  };*/

  ge_add (p1, p2) {
      if (p1.length !== 64 || p2.length !== 64) {
          throw "Invalid input length!";
      }
      return this.bintohex(this.sNacl.ge_add(this.hextobin(p1), this.hextobin(p2)));
  };

  //order matters
  ge_sub (point1, point2) {
      let point2n = this.ge_neg(point2);
      return this.ge_add(point1, point2n);
  };

  //adds two scalars together
  sc_add (scalar1, scalar2) {
      if (scalar1.length !== 64 || scalar2.length !== 64) {
          throw "Invalid input length!";
      }
      let scalar1_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      let scalar2_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      Module.HEAPU8.set(this.hextobin(scalar1), scalar1_m);
      Module.HEAPU8.set(this.hextobin(scalar2), scalar2_m);
      let derived_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      Module.ccall("sc_add", "void", ["number", "number", "number"], [derived_m, scalar1_m, scalar2_m]);
      let res = Module.HEAPU8.subarray(derived_m, derived_m + this.STRUCT_SIZES.EC_SCALAR);
      Module._free(scalar1_m);
      Module._free(scalar2_m);
      Module._free(derived_m);
      return this.bintohex(res);
  };

  //subtracts one scalar from another
  sc_sub (scalar1, scalar2) {
      if (scalar1.length !== 64 || scalar2.length !== 64) {
          throw "Invalid input length!";
      }
      let scalar1_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      let scalar2_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      Module.HEAPU8.set(this.hextobin(scalar1), scalar1_m);
      Module.HEAPU8.set(this.hextobin(scalar2), scalar2_m);
      let derived_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      Module.ccall("sc_sub", "void", ["number", "number", "number"], [derived_m, scalar1_m, scalar2_m]);
      let res = Module.HEAPU8.subarray(derived_m, derived_m + this.STRUCT_SIZES.EC_SCALAR);
      Module._free(scalar1_m);
      Module._free(scalar2_m);
      Module._free(derived_m);
      return this.bintohex(res);
  };

  //fun mul function
  sc_mul (scalar1, scalar2) {
      if (scalar1.length !== 64 || scalar2.length !== 64) {
          throw "Invalid input length!";
      }
      return this.d2s(JSBigInt(this.s2d(scalar1),null).multiply(JSBigInt(this.s2d(scalar2),null)).remainder(this.l).toString());
  };

  //res = c - (ab) mod l; argument names copied from the signature implementation
  sc_mulsub (sigc, sec, k) {
      if (k.length !== this.KEY_SIZE * 2 || sigc.length !== this.KEY_SIZE * 2 || sec.length !== this.KEY_SIZE * 2 || !this.valid_hex(k) || !this.valid_hex(sigc) || !this.valid_hex(sec)) {
          throw "bad scalar";
      }
      let sec_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(this.hextobin(sec), sec_m);
      let sigc_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(this.hextobin(sigc), sigc_m);
      let k_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(this.hextobin(k), k_m);
      let res_m = Module._malloc(this.KEY_SIZE);

      Module.ccall("sc_mulsub", "void", ["number", "number", "number", "number"], [res_m, sigc_m, sec_m, k_m]);
      let res = Module.HEAPU8.subarray(res_m, res_m + this.KEY_SIZE);
      Module._free(k_m);
      Module._free(sec_m);
      Module._free(sigc_m);
      Module._free(res_m);
      return this.bintohex(res);
  };


  ge_double_scalarmult_base_vartime (c, P, r) {
      if (c.length !== 64 || P.length !== 64 || r.length !== 64) {
          throw "Invalid input length!";
      }
      return this.bintohex(this.sNacl.ge_double_scalarmult_base_vartime(this.hextobin(c), this.hextobin(P), this.hextobin(r)));
  };

  //res = a * Hp(B) + c*D
  //res = sigr * Hp(pub) + sigc * k_image; argument names also copied from the signature implementation; note precomp AND hash_to_ec are done internally!!
  /*this.ge_double_scalarmult_postcomp_vartime (sigr, pub, sigc, k_image) {
      let image_m = Module._malloc(STRUCT_SIZES.KEY_IMAGE);
      Module.HEAPU8.set(this.hextobin(k_image), image_m);
      let image_unp_m = Module._malloc(STRUCT_SIZES.GE_P3);
      let image_pre_m = Module._malloc(STRUCT_SIZES.GE_DSMP);
      let tmp3_m = Module._malloc(STRUCT_SIZES.GE_P3);
      let sigr_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
      let sigc_m = Module._malloc(STRUCT_SIZES.EC_SCALAR);
      let tmp2_m = Module._malloc(STRUCT_SIZES.GE_P2);
      let res_m = Module._malloc(STRUCT_SIZES.EC_POINT);
      if (Module.ccall("ge_frombytes_vartime", "void", ["number", "number"], [image_unp_m, image_m]) !== 0) {
          throw "Failed to call ge_frombytes_vartime";
      }
      Module.ccall("ge_dsm_precomp", "void", ["number", "number"], [image_pre_m, image_unp_m]);
      let ec = this.hash_to_ec(pub);
      Module.HEAPU8.set(this.hextobin(ec), tmp3_m);
      Module.HEAPU8.set(this.hextobin(sigc), sigc_m);
      Module.HEAPU8.set(this.hextobin(sigr), sigr_m);
      Module.ccall("ge_double_scalarmult_precomp_vartime", "void", ["number", "number", "number", "number", "number"], [tmp2_m, sigr_m, tmp3_m, sigc_m, image_pre_m]);
      Module.ccall("ge_tobytes", "void", ["number", "number"], [res_m, tmp2_m]);
      let res = Module. HEAPU8.subarray(res_m, res_m + STRUCT_SIZES.EC_POINT);
      Module._free(image_m);
      Module._free(image_unp_m);
      Module._free(image_pre_m);
      Module._free(tmp3_m);
      Module._free(sigr_m);
      Module._free(sigc_m);
      Module._free(tmp2_m);
      Module._free(res_m);
      return this.bintohex(res);
  };*/

  ge_double_scalarmult_postcomp_vartime (r, P, c, I) {
      if (c.length !== 64 || P.length !== 64 || r.length !== 64 || I.length !== 64) {
          throw "Invalid input length!";
      }
      let Pb = this.hash_to_ec_2(P);
      return this.bintohex(this.sNacl.ge_double_scalarmult_postcomp_vartime(this.hextobin(r), this.hextobin(Pb), this.hextobin(c), this.hextobin(I)));
  };
      
      

  //begin RCT functions

  //xv: vector of secret keys, 1 per ring (nrings)
  //pm: matrix of pubkeys, indexed by size first
  //iv: vector of indexes, 1 per ring (nrings), can be a string
  //size: ring size
  //nrings: number of rings
  //extensible borromean signatures
  genBorromean (xv, pm, iv, size, nrings){
    if (xv.length !== nrings){
      throw "wrong xv length " + xv.length;
    }
    if (pm.length !== size){
      throw "wrong pm size " + pm.length;
    }
    for (let i = 0; i < pm.length; i++){
      if (pm[i].length !== nrings){
        throw "wrong pm[" + i + "] length " + pm[i].length;
      }
    }
    if (iv.length !== nrings){
      throw "wrong iv length " + iv.length;
    }
    for (let i = 0; i < iv.length; i++){
      if (iv[i] >= size){
        throw "bad indices value at: " + i + ": " + iv[i];
      }
    }
    //signature struct
    let bb = {
      s: [],
      ee: ""
    };
    //signature pubkey matrix
    let L = [];
    //add needed sub vectors (1 per ring size)
    for (let i = 0; i < size; i++){
      bb.s[i] = [];
      L[i] = [];
    }
    //compute starting at the secret index to the last row
    let index;
    let alpha = [];
    for (let i = 0; i < nrings; i++){
      index = parseInt(iv[i]);
      alpha[i] = this.random_scalar();
      L[index][i] = this.ge_scalarmult_base(alpha[i]);
      for (let j = index + 1; j < size; j++){
        bb.s[j][i] = this.random_scalar();
        let c = this.hash_to_scalar(L[j-1][i]);
        L[j][i] = this.ge_double_scalarmult_base_vartime(c, pm[j][i], bb.s[j][i]);
      }
    }
    //hash last row to create ee
    let ltemp = "";
    for (let i = 0; i < nrings; i++){
      ltemp += L[size-1][i];
    }
    bb.ee = this.hash_to_scalar(ltemp);
    //compute the rest from 0 to secret index
    for (let i = 0; i < nrings; i++){
      let cc = bb.ee
      let j:any;
      for (j = 0; j < iv[i]; j++){
        bb.s[j][i] = this.random_scalar();
        let LL = this.ge_double_scalarmult_base_vartime(cc, pm[j][i], bb.s[j][i]);
        cc = this.hash_to_scalar(LL);
      }
      bb.s[j][i] = this.sc_mulsub(xv[i], cc, alpha[i]);
    }
    return bb;
  };
  
  //proveRange
  //proveRange gives C, and mask such that \sumCi = C
  //   c.f. http://eprint.iacr.org/2015/1098 section 5.1
  //   and Ci is a commitment to either 0 or s^i, i=0,...,n
  //   thus this proves that "amount" is in [0, s^n] (we assume s to be 4) (2 for now with v2 txes)
  //   mask is a such that C = aG + bH, and b = amount
  //commitMaskObj = {C: commit, mask: mask}
  proveRange (commitMaskObj, amount, nrings, enc_seed, exponent){
    let size = 2;
    let C = this.I; //identity
    let mask = this.Z; //zero scalar
    let indices = this.d2b(amount); //base 2 for now
    let sig = {
      Ci: [],
      bsig:{}
    }
    /*payload stuff - ignore for now
    seeds = new Array(3);
    for (let i = 0; i < seeds.length; i++){
      seeds[i] = new Array(1);
    }
    genSeeds(seeds, enc_seed);
    */
    let ai = [];
    let PM = [];
    for (let i = 0; i < size; i++){
      PM[i] = [];
    }
    let j;
    //start at index and fill PM left and right -- PM[0] holds Ci
    for (let i = 0; i < nrings; i++){
      ai[i] = this.random_scalar();
      j = indices[i];
      PM[j][i] = this.ge_scalarmult_base(ai[i]);
      while (j > 0){
        j--;
        PM[j][i] = this.ge_add(PM[j+1][i], this.H2[i]); //will need to use i*2 for base 4 (or different object)
      }
      j = indices[i];
      while (j < size - 1){
        j++;
        PM[j][i] = this.ge_sub(PM[j-1][i], this.H2[i]); //will need to use i*2 for base 4 (or different object)
      }
      mask = this.sc_add(mask, ai[i]);
    }
    /*
    * some more payload stuff here
    */
    //copy commitments to sig and sum them to commitment
    for (let i = 0; i < nrings; i++){
      //if (i < nrings - 1) //for later version
      sig.Ci[i] = PM[0][i];
      C = this.ge_add(C, PM[0][i]);
    }
    /* exponent stuff - ignore for now
    if (exponent){
      n = JSBigInt(10);
      n = n.pow(exponent).toString();
      mask = sc_mul(mask, d2s(n)); //new sum
    }
    */
    sig.bsig = this.genBorromean(ai, PM, indices, size, nrings);
    commitMaskObj.C = C;
    commitMaskObj.mask = mask;
    return sig;
  };
  
  
  array_hash_to_scalar(array){
    let buf = ""
    for (let i = 0; i < array.length; i++){
      if (typeof array[i] !== "string"){throw "unexpected array element";}
      buf += array[i];
    }
    return this.hash_to_scalar(buf);
  }
  
  // Gen creates a signature which proves that for some column in the keymatrix "pk"
  //   the signer knows a secret key for each row in that column
  // we presently only support matrices of 2 rows (pubkey, commitment)
  // this is a simplied MLSAG_Gen to reflect that
  // because we don't want to force same secret column for all inputs
  MLSAG_Gen (message, pk, xx, kimg, index){
    let cols = pk.length; //ring size
    if (index >= cols){throw "index out of range";}
    let rows = pk[0].length; //number of signature rows (always 2)
    if (rows !== 2){throw "wrong row count";}
    for (let i = 0; i < cols; i++){
      if (pk[i].length !== rows){throw "pk is not rectangular";}
    }
    if (xx.length !== rows){throw "bad xx size";}
  
    let c_old = "";
    let alpha = [];
  
    let rv = {
      ss: [],
      cc: null
    };
    for (let i = 0; i < cols; i++){
      rv.ss[i] = [];
    }
    let toHash = []; //holds 6 elements: message, pubkey, dsRow L, dsRow R, commitment, ndsRow L
    toHash[0] = message;
    
    //secret index (pubkey section)
    alpha[0] = this.random_scalar(); //need to save alphas for later
    toHash[1] = pk[index][0]; //secret index pubkey
    toHash[2] = this.ge_scalarmult_base(alpha[0]); //dsRow L
    toHash[3] = this.generate_key_image_2(pk[index][0], alpha[0]); //dsRow R (key image check)
    //secret index (commitment section)
    alpha[1] = this.random_scalar();
    toHash[4] = pk[index][1]; //secret index commitment
    toHash[5] = this.ge_scalarmult_base(alpha[1]); //ndsRow L
  
    c_old = this.array_hash_to_scalar(toHash);
  
    let i = (index + 1) % cols;
    if (i === 0){
      rv.cc = c_old;
    }
    while (i != index){
      rv.ss[i][0] = this.random_scalar(); //dsRow ss
      rv.ss[i][1] = this.random_scalar(); //ndsRow ss
  
      //!secret index (pubkey section)
      toHash[1] = pk[i][0];
      toHash[2] = this.ge_double_scalarmult_base_vartime(c_old, pk[i][0], rv.ss[i][0]);
      toHash[3] = this.ge_double_scalarmult_postcomp_vartime(rv.ss[i][0], pk[i][0], c_old, kimg);
      //!secret index (commitment section)
      toHash[4] = pk[i][1];
      toHash[5] = this.ge_double_scalarmult_base_vartime(c_old, pk[i][1], rv.ss[i][1]);
      c_old = this.array_hash_to_scalar(toHash); //hash to get next column c
      i = (i + 1) % cols;
      if (i === 0){
        rv.cc = c_old;
      }
    }
    for (i = 0; i < rows; i++){
      rv.ss[index][i] = this.sc_mulsub(c_old, xx[i], alpha[i]);
    }
    return rv;
  };
  
  //prepares for MLSAG_Gen
  proveRctMG (message, pubs, inSk, kimg, mask, Cout, index){
    let cols = pubs.length;
    if (cols < 3){throw "cols must be > 2 (mixin)";}
    let xx = [];
    let PK = [];
    //fill pubkey matrix (copy destination, subtract commitments)
    for (let i = 0; i < cols; i++){
      PK[i] = [];
      PK[i][0] = pubs[i].dest;
      PK[i][1] = this.ge_sub(pubs[i].mask, Cout);
    }
    xx[0] = inSk.x;
    xx[1] = this.sc_sub(inSk.a, mask);
    return this.MLSAG_Gen(message, PK, xx, kimg, index);
  };

  get_pre_mlsag_hash (rv) {
      let hashes = "";
      hashes += rv.message;
      hashes += this.cn_fast_hash(this.serialize_rct_base(rv), null);
      let buf = this.serialize_range_proofs(rv);
      hashes += this.cn_fast_hash(buf, null);
      return this.cn_fast_hash(hashes, null);
  }

  serialize_range_proofs(rv) {
      let buf = "";
      for (let i = 0; i < rv.p.rangeSigs.length; i++) {
          for (let j = 0; j < rv.p.rangeSigs[i].bsig.s.length; j++) {
              for (let l = 0; l < rv.p.rangeSigs[i].bsig.s[j].length; l++) {
                  buf += rv.p.rangeSigs[i].bsig.s[j][l];
              }
          }
          buf += rv.p.rangeSigs[i].bsig.ee;
          for (let j = 0; j < rv.p.rangeSigs[i].Ci.length; j++) {
              buf += rv.p.rangeSigs[i].Ci[j];
          }
      }
      return buf;
  }
  
  //message is normal prefix hash
  //inSk is vector of x,a
  //kimg is vector of kimg
  //destinations is vector of pubkeys (we skip and proxy outAmounts instead)
  //inAmounts is vector of strings
  //outAmounts is vector of strings
  //mixRing is matrix of pubkey, commit (dest, mask)
  //amountKeys is vector of scalars
  //indices is vector
  //txnFee is string
  genRct (message, inSk, kimg, /*destinations, */inAmounts, outAmounts, mixRing, amountKeys, indices, txnFee){
    if (outAmounts.length !== amountKeys.length ){throw "different number of amounts/amount_keys";}
    for (let i = 0; i < mixRing.length; i++){
      if (mixRing[i].length <= indices[i]){throw "bad mixRing/index size";}
    }
    if (mixRing.length !== inSk.length){throw "mismatched mixRing/inSk";}
    if (inAmounts.length !== inSk.length){throw "mismatched inAmounts/inSk";}
    if (indices.length !== inSk.length){throw "mismatched indices/inSk";}
    
    let rv = {
      type: inSk.length === 1 ? this.RCTTypeFull : this.RCTTypeSimple,
      message: message,
      outPk: [],
      p: {
        rangeSigs: [],
        MGs: []
      },
      ecdhInfo: [],
      txnFee: txnFee.toString(),
      pseudoOuts: []
    };
    
    let sumout = this.Z;
    let cmObj = {
      C: null,
      mask: null
    };
    let nrings = 64; //for base 2/current
    //compute range proofs, etc
    for (let i = 0; i < outAmounts.length; i++){
      let teststart = new Date().getTime();
      rv.p.rangeSigs[i] = this.proveRange(cmObj, outAmounts[i], nrings, 0, 0);
      let testfinish = new Date().getTime() - teststart;
      //console.log("Time take for range proof " + i + ": " + testfinish);
      rv.outPk[i] = cmObj.C;
      sumout = this.sc_add(sumout, cmObj.mask);
      rv.ecdhInfo[i] = this.encode_rct_ecdh({mask: cmObj.mask, amount: this.d2s(outAmounts[i])}, amountKeys[i]);
    }
    //simple
    if (rv.type === 2){
      let ai = [];
      let sumpouts = this.Z;
      //create pseudoOuts
      let i:any;
      for (i = 0; i < inAmounts.length - 1; i++){
        
        ai[i] = this.random_scalar();
        sumpouts = this.sc_add(sumpouts, ai[i]);
        rv.pseudoOuts[i] = this.commit(this.d2s(inAmounts[i]), ai[i]);
      }
      ai[i] = this.sc_sub(sumout, sumpouts);
      rv.pseudoOuts[i] = this.commit(this.d2s(inAmounts[i]), ai[i]);
      let full_message = this.get_pre_mlsag_hash(rv);
      for (let i = 0; i < inAmounts.length; i++){
        rv.p.MGs.push(this.proveRctMG(full_message, mixRing[i], inSk[i], kimg[i], ai[i], rv.pseudoOuts[i], indices[i]));
      }
    } else {
      let sumC = this.I;
      //get sum of output commitments to use in MLSAG
      for (let i = 0; i < rv.outPk.length; i++){
        sumC = this.ge_add(sumC, rv.outPk[i]);
      }
      sumC = this.ge_add(sumC, this.ge_scalarmult(this.H, this.d2s(rv.txnFee)));
      let full_message = this.get_pre_mlsag_hash(rv);
      rv.p.MGs.push(this.proveRctMG(full_message, mixRing[0], inSk[0], kimg[0], sumout, sumC, indices[0]));
    }
    
    return rv;
  };

  //end RCT functions


  add_pub_key_to_extra (extra, pubkey) {
      if (pubkey.length !== 64) throw "Invalid pubkey length";
      // Append pubkey tag and pubkey
      extra += this.TX_EXTRA_TAGS.PUBKEY + pubkey;
      return extra;
  };

  add_nonce_to_extra (extra, nonce) {
      // Append extra nonce
      if ((nonce.length % 2) !== 0) {
          throw "Invalid extra nonce";
      }
      if ((nonce.length / 2) > this.TX_EXTRA_NONCE_MAX_COUNT) {
          throw "Extra nonce must be at most " + this.TX_EXTRA_NONCE_MAX_COUNT + " bytes";
      }
      // Add nonce tag
      extra += this.TX_EXTRA_TAGS.NONCE;
      // Encode length of nonce
      extra += ('0' + (nonce.length / 2).toString(16)).slice(-2);
      // Write nonce
      extra += nonce;
      return extra;
  };

  get_payment_id_nonce (payment_id, pid_encrypt) {
      if (payment_id.length !== 64 && payment_id.length !== 16) {
          throw "Invalid payment id";
      }
      let res = '';
      if (pid_encrypt) {
          res += this.TX_EXTRA_NONCE_TAGS.ENCRYPTED_PAYMENT_ID;
      } else {
          res += this.TX_EXTRA_NONCE_TAGS.PAYMENT_ID;
      }
      res += payment_id;
      return res;
  };

  abs_to_rel_offsets (offsets) {
      if (offsets.length === 0) return offsets;
      for (let i = offsets.length - 1; i >= 1; --i) {
          offsets[i] = JSBigInt(offsets[i],null).subtract(offsets[i - 1]).toString();
      }
      return offsets;
  };

  get_tx_prefix_hash (tx) {
      let prefix = this.serialize_tx(tx, true);
      return this.cn_fast_hash(prefix, null);
  };

  get_tx_hash (tx) {
      if (typeof(tx) === 'string') {
          return this.cn_fast_hash(tx, null);
      } else {
          return this.cn_fast_hash(this.serialize_tx(tx, null),null);
      }
  };

  serialize_tx (tx, headeronly) {
      //tx: {
      //  version: uint64,
      //  unlock_time: uint64,
      //  extra: hex,
      //  vin: [{amount: uint64, k_image: hex, key_offsets: [uint64,..]},...],
      //  vout: [{amount: uint64, target: {key: hex}},...],
      //  signatures: [[s,s,...],...]
      //}
      if (headeronly === null) {
          headeronly = false;
      }
      let buf = "";
      buf += this.encode_letint(tx.version);
      buf += this.encode_letint(tx.unlock_time);
      buf += this.encode_letint(tx.vin.length);
      let i, j;
      for (i = 0; i < tx.vin.length; i++) {
          let vin = tx.vin[i];
          switch (vin.type) {
              case "input_to_key":
                  buf += "02";
                  buf += this.encode_letint(vin.amount);
                  buf += this.encode_letint(vin.key_offsets.length);
                  for (j = 0; j < vin.key_offsets.length; j++) {
                      buf += this.encode_letint(vin.key_offsets[j]);
                  }
                  buf += vin.k_image;
                  break;
              default:
                  throw "Unhandled vin type: " + vin.type;
          }
      }
      buf += this.encode_letint(tx.vout.length);
      for (i = 0; i < tx.vout.length; i++) {
          let vout = tx.vout[i];
          buf += this.encode_letint(vout.amount);
          switch (vout.target.type) {
              case "txout_to_key":
                  buf += "02";
                  buf += vout.target.key;
                  break;
              default:
                  throw "Unhandled txout target type: " + vout.target.type;
          }
      }
      if (!this.valid_hex(tx.extra)) {
          throw "Tx extra has invalid hex";
      }
      buf += this.encode_letint(tx.extra.length / 2);
      buf += tx.extra;
      if (!headeronly) {
          if (tx.vin.length !== tx.signatures.length) {
              throw "Signatures length != vin length";
          }
          for (i = 0; i < tx.vin.length; i++) {
              for (j = 0; j < tx.signatures[i].length; j++) {
                  buf += tx.signatures[i][j];
              }
          }
      }
      return buf;
  };

  serialize_rct_tx_with_hash (tx) {
      let hashes = "";
      let buf = "";
      buf += this.serialize_tx(tx, true);
      hashes += this.cn_fast_hash(buf, null);
      let buf2 = this.serialize_rct_base(tx.rct_signatures);
      hashes += this.cn_fast_hash(buf2, null);
      buf += buf2;
      let buf3 = this.serialize_range_proofs(tx.rct_signatures);
      //add MGs
      for (let i = 0; i < tx.rct_signatures.p.MGs.length; i++) {
          for (let j = 0; j < tx.rct_signatures.p.MGs[i].ss.length; j++) {
              buf3 += tx.rct_signatures.p.MGs[i].ss[j][0];
              buf3 += tx.rct_signatures.p.MGs[i].ss[j][1];
          }
          buf3 += tx.rct_signatures.p.MGs[i].cc;
      }
      hashes += this.cn_fast_hash(buf3, null);
      buf += buf3;
      let hash = this.cn_fast_hash(hashes, null);
      return {
          raw: buf,
          hash: hash,
          prvkey: tx.prvkey
      };
  };

  serialize_rct_base (rv) {
      let buf = "";
      buf += this.encode_letint(rv.type);
      buf += this.encode_letint(rv.txnFee);
      if (rv.type === 2) {
          for (let i = 0; i < rv.pseudoOuts.length; i++) {
              buf += rv.pseudoOuts[i];
          }
      }
      if (rv.ecdhInfo.length !== rv.outPk.length) {
          throw "mismatched outPk/ecdhInfo!";
      }
      for (let i = 0; i < rv.ecdhInfo.length; i++) {
          buf += rv.ecdhInfo[i].mask;
          buf += rv.ecdhInfo[i].amount;
      }
      for (let i = 0; i < rv.outPk.length; i++) {
          buf += rv.outPk[i];
      }
      return buf;
  };

  generate_ring_signature (prefix_hash, k_image, keys, sec, real_index) {
      if (k_image.length !== this.STRUCT_SIZES.KEY_IMAGE * 2) {
          throw "invalid key image length";
      }
      if (sec.length !== this.KEY_SIZE * 2) {
          throw "Invalid secret key length";
      }
      if (prefix_hash.length !== this.HASH_SIZE * 2 || !this.valid_hex(prefix_hash)) {
          throw "Invalid prefix hash";
      }
      if (real_index >= keys.length || real_index < 0) {
          throw "real_index is invalid";
      }
      let _ge_tobytes = Module.cwrap("ge_tobytes", "void", ["number", "number"]);
      let _ge_p3_tobytes = Module.cwrap("ge_p3_tobytes", "void", ["number", "number"]);
      let _ge_scalarmult_base = Module.cwrap("ge_scalarmult_base", "void", ["number", "number"]);
      let _ge_scalarmult = Module.cwrap("ge_scalarmult", "void", ["number", "number", "number"]);
      let _sc_add = Module.cwrap("sc_add", "void", ["number", "number", "number"]);
      let _sc_sub = Module.cwrap("sc_sub", "void", ["number", "number", "number"]);
      let _sc_mulsub = Module.cwrap("sc_mulsub", "void", ["number", "number", "number", "number"]);
      let _sc_0 = Module.cwrap("sc_0", "void", ["number"]);
      let _ge_double_scalarmult_base_vartime = Module.cwrap("ge_double_scalarmult_base_vartime", "void", ["number", "number", "number", "number"]);
      let _ge_double_scalarmult_precomp_vartime = Module.cwrap("ge_double_scalarmult_precomp_vartime", "void", ["number", "number", "number", "number", "number"]);
      let _ge_frombytes_vartime = Module.cwrap("ge_frombytes_vartime", "number", ["number", "number"]);
      let _ge_dsm_precomp = Module.cwrap("ge_dsm_precomp", "void", ["number", "number"]);

      
      
      let sig_size = this.STRUCT_SIZES.SIGNATURE * keys.length;
      this.sig_m = Module._malloc(sig_size);

      // Struct pointer helper functions
      
      let image_m = Module._malloc(this.STRUCT_SIZES.KEY_IMAGE);
      Module.HEAPU8.set(this.hextobin(k_image), image_m);
      let i;
      let image_unp_m = Module._malloc(this.STRUCT_SIZES.GE_P3);
      let image_pre_m = Module._malloc(this.STRUCT_SIZES.GE_DSMP);
      let sum_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      let k_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      let h_m = Module._malloc(this.STRUCT_SIZES.EC_SCALAR);
      let tmp2_m = Module._malloc(this.STRUCT_SIZES.GE_P2);
      let tmp3_m = Module._malloc(this.STRUCT_SIZES.GE_P3);
      let pub_m = Module._malloc(this.KEY_SIZE);
      let sec_m = Module._malloc(this.KEY_SIZE);
      Module.HEAPU8.set(this.hextobin(sec), sec_m);
      if (_ge_frombytes_vartime(image_unp_m, image_m) != 0) {
          throw "failed to call ge_frombytes_vartime";
      }
      _ge_dsm_precomp(image_pre_m, image_unp_m);
      _sc_0(sum_m);
      for (i = 0; i < keys.length; i++) {
          if (i === real_index) {
              // Real key
              let rand = this.random_scalar();
              Module.HEAPU8.set(this.hextobin(rand), k_m);
              _ge_scalarmult_base(tmp3_m, k_m);
              _ge_p3_tobytes(this.buf_a(i), tmp3_m);
              let ec = this.hash_to_ec(keys[i]);
              Module.HEAPU8.set(this.hextobin(ec), tmp3_m);
              _ge_scalarmult(tmp2_m, k_m, tmp3_m);
              _ge_tobytes(this.buf_b(i), tmp2_m);
          } else {
              Module.HEAPU8.set(this.hextobin(this.random_scalar()), this.sig_c(i));
              Module.HEAPU8.set(this.hextobin(this.random_scalar()), this.sig_r(i));
              Module.HEAPU8.set(this.hextobin(keys[i]), pub_m);
              if (Module.ccall("ge_frombytes_vartime", "void", ["number", "number"], [tmp3_m, pub_m]) !== 0) {
                  throw "Failed to call ge_frombytes_vartime";
              }
              _ge_double_scalarmult_base_vartime(tmp2_m, this.sig_c(i), tmp3_m, this.sig_r(i));
              _ge_tobytes(this.buf_a(i), tmp2_m);
              let ec = this.hash_to_ec(keys[i]);
              Module.HEAPU8.set(this.hextobin(ec), tmp3_m);
              _ge_double_scalarmult_precomp_vartime(tmp2_m, this.sig_r(i), tmp3_m, this.sig_c(i), image_pre_m);
              _ge_tobytes(this.buf_b(i), tmp2_m);
              _sc_add(sum_m, sum_m, this.sig_c(i));
          }
      }
      let buf_bin = Module.HEAPU8.subarray(this.buf_m, this.buf_m + this.buf_size);
      let scalar = this.hash_to_scalar(prefix_hash + this.bintohex(buf_bin));
      Module.HEAPU8.set(this.hextobin(scalar), h_m);
      _sc_sub(this.sig_c(real_index), h_m, sum_m);
      _sc_mulsub(this.sig_r(real_index), this.sig_c(real_index), sec_m, k_m);
      let sig_data = this.bintohex(Module.HEAPU8.subarray(this.sig_m, this.sig_m + sig_size));
      let sigs = [];
      for (let k = 0; k < keys.length; k++) {
          sigs.push(sig_data.slice(this.STRUCT_SIZES.SIGNATURE * 2 * k, this.STRUCT_SIZES.SIGNATURE * 2 * (k + 1)));
      }
      Module._free(image_m);
      Module._free(image_unp_m);
      Module._free(image_pre_m);
      Module._free(sum_m);
      Module._free(k_m);
      Module._free(h_m);
      Module._free(tmp2_m);
      Module._free(tmp3_m);
      Module._free(this.buf_m);
      Module._free(this.sig_m);
      Module._free(pub_m);
      Module._free(sec_m);
      return sigs;
  };
  buf_size;
  buf_m;
  sig_m;
  buf_a(i) {
    return this.buf_m + this.STRUCT_SIZES.EC_POINT * (2 * i);
  }
  buf_b(i) {
      return this.buf_m + this.STRUCT_SIZES.EC_POINT * (2 * i + 1);
  }
  sig_c(i) {
      return this.sig_m + this.STRUCT_SIZES.EC_SCALAR * (2 * i);
  }
  sig_r(i) {
      return this.sig_m + this.STRUCT_SIZES.EC_SCALAR * (2 * i + 1);
  }
  construct_tx (keys, sources, dsts, fee_amount, payment_id, pid_encrypt, realDestViewKey, unlock_time, rct) {
      //we move payment ID stuff here, because we need txkey to encrypt
      let txkey = this.random_keypair();
      let extra = '';
      if (payment_id) {
          if (pid_encrypt && payment_id.length !== this.INTEGRATED_ID_SIZE * 2) {
              throw "payment ID must be " + this.INTEGRATED_ID_SIZE + " bytes to be encrypted!";
          }
          console.log("Adding payment id: " + payment_id);
          if (pid_encrypt) { //get the derivation from our passed viewkey, then hash that + tail to get encryption key
              let pid_key = this.cn_fast_hash(this.generate_key_derivation(realDestViewKey, txkey.sec) + this.ENCRYPTED_PAYMENT_ID_TAIL.toString(16),null).slice(0, this.INTEGRATED_ID_SIZE * 2);
              console.log("Txkeys:", txkey, "Payment ID key:", pid_key);
              payment_id = this.hex_xor(payment_id, pid_key);
          }
          let nonce = this.get_payment_id_nonce(payment_id, pid_encrypt);
          console.log("Extra nonce: " + nonce);
          extra = this.add_nonce_to_extra(extra, nonce);
      }
      let tx = {
          unlock_time: unlock_time,
          version: rct ? this.CURRENT_TX_VERSION : this.OLD_TX_VERSION,
          extra: extra,
          prvkey: '',
          vin: [],
          vout: [],
          rct_signatures:null,
          signatures:null
      };
      if (rct) {
          tx.rct_signatures = {};
      } else {
          tx.signatures = [];
      }
      tx.extra = this.add_pub_key_to_extra(tx.extra, txkey.pub);
      tx.prvkey = txkey.sec;

      let in_contexts  = [];

      let is_rct_coinbases = []; // monkey patching to solve problem of
                                 // not being able to spend coinbase ringct txs.

      let inputs_money = JSBigInt.ZERO;
      let i, j;

      console.log('Sources: ');

      for (i = 0; i < sources.length; i++)
      {
          console.log(i + ': ' + this.formatMoneyFull(sources[i].amount));
          if (sources[i].real_out >= sources[i].outputs.length) {
              throw "real index >= outputs.length";
          }
          inputs_money = inputs_money.add(sources[i].amount);

          // sets res.mask among other things. mask is identity for non-rct transactions
          // and for coinbase ringct (type = 0) txs.
          let res = this.generate_key_image_helper_rct(keys, sources[i].real_out_tx_key, sources[i].real_out_in_tx, sources[i].mask); //mask will be undefined for non-rct

          in_contexts.push(res.in_ephemeral);

          // now we mark if this is ringct coinbase txs. such transactions
          // will have identity mask. Non-ringct txs will have  sources[i].mask set to null.
          // this only works if beckend will produce masks in get_unspent_outs for
          // coinbaser ringct txs.
          is_rct_coinbases.push((sources[i].mask ? sources[i].mask === this.I : 0));


          if (res.in_ephemeral.pub !== sources[i].outputs[sources[i].real_out].key) {
              throw "in_ephemeral.pub != source.real_out.key";
          }
          let input_to_key = {
            type : "input_to_key",
            amount : sources[i].amount,
            k_image : res.image,
            key_offsets : []
          };

          for (j = 0; j < sources[i].outputs.length; ++j) {
              input_to_key.key_offsets.push(sources[i].outputs[j].index);
          }
          input_to_key.key_offsets = this.abs_to_rel_offsets(input_to_key.key_offsets);
          tx.vin.push(input_to_key);
      }
      let outputs_money = JSBigInt.ZERO;
      let out_index = 0;
      let amountKeys = []; //rct only
      for (i = 0; i < dsts.length; ++i) {
          if (JSBigInt(dsts[i].amount,null).compare(0) < 0) {
              throw "dst.amount < 0"; //amount can be zero if no change
          }
          dsts[i].keys = this.decode_address(dsts[i].address);
          let out_derivation = this.generate_key_derivation(dsts[i].keys.view, txkey.sec);
          if (rct) {
              amountKeys.push(this.derivation_to_scalar(out_derivation, out_index));
          }
          let out_ephemeral_pub = this.derive_public_key(out_derivation, out_index, dsts[i].keys.spend);
          let out = {
              amount: dsts[i].amount.toString(),
              target: null
          };
          // txout_to_key
          out.target = {
              type: "txout_to_key",
              key: out_ephemeral_pub
          };
          tx.vout.push(out);
          ++out_index;
          outputs_money = outputs_money.add(dsts[i].amount);
      }
      if (outputs_money.add(fee_amount).compare(inputs_money) > 0) {
          throw "outputs money (" + this.formatMoneyFull(outputs_money) + ") + fee (" + this.formatMoneyFull(fee_amount) + ") > inputs money (" + this.formatMoneyFull(inputs_money) + ")";
      }
      if (!rct) {
          for (i = 0; i < sources.length; ++i) {
              let src_keys = [];
              for (j = 0; j < sources[i].outputs.length; ++j) {
                  src_keys.push(sources[i].outputs[j].key);
              }
              let sigs = this.generate_ring_signature(this.get_tx_prefix_hash(tx), tx.vin[i].k_image, src_keys,
                  in_contexts[i].sec, sources[i].real_out);
              tx.signatures.push(sigs);
          }
      } else { //rct
          let txnFee = fee_amount;
          let keyimages = [];
          let inSk = [];
          let inAmounts = [];
          let mixRing = [];
          let indices = [];
          for (i = 0; i < tx.vin.length; i++) {
              keyimages.push(tx.vin[i].k_image);
              inSk.push({
                  x: in_contexts[i].sec,
                  a: in_contexts[i].mask
              });
              inAmounts.push(tx.vin[i].amount);

              //if (in_contexts[i].mask !== I) {//if input is rct (has a valid mask), 0 out amount
                  //tx.vin[i].amount = "0";
              //}

              if (in_contexts[i].mask !== this.I || is_rct_coinbases[i] === true)
              {
                  // if input is rct (has a valid mask), 0 out amount
                  // coinbase ringct txs also have mask === I, so their amount
                  // must be set to zero when spending them.
                  tx.vin[i].amount = "0";
              }

              mixRing[i] = [];
              for (j = 0; j < sources[i].outputs.length; j++) {
                  mixRing[i].push({
                      dest: sources[i].outputs[j].key,
                      mask: sources[i].outputs[j].commit
                  });
              }
              indices.push(sources[i].real_out);
          }
          let outAmounts = [];
          for (i = 0; i < tx.vout.length; i++) {
              outAmounts.push(tx.vout[i].amount);
              tx.vout[i].amount = "0"; //zero out all rct outputs
          }
          let tx_prefix_hash = this.get_tx_prefix_hash(tx);
          tx.rct_signatures = this.genRct(tx_prefix_hash, inSk, keyimages, /*destinations, */inAmounts, outAmounts, mixRing, amountKeys, indices, txnFee);

      }
      console.log(tx);
      return tx;
  };
  create_transaction (pub_keys, sec_keys, dsts, outputs, mix_outs, fake_outputs_count, fee_amount, payment_id, pid_encrypt, realDestViewKey, unlock_time, rct) {
      unlock_time = unlock_time || 0;
      mix_outs = mix_outs || [];
      let i, j;
      if (dsts.length === 0) {
        console.log('Destinations empty');
          throw 'Destinations empty';
      }
      if (mix_outs.length !== outputs.length && fake_outputs_count !== 0) {
        console.log('Wrong number of mix outs provided (' + outputs.length + ' outputs, ' + mix_outs.length + ' mix outs)');
          throw 'Wrong number of mix outs provided (' + outputs.length + ' outputs, ' + mix_outs.length + ' mix outs)';
      }
      for (i = 0; i < mix_outs.length; i++) {
          if ((mix_outs[i].outputs || []).length < fake_outputs_count) {
            console.log('Not enough outputs to mix with');
              throw 'Not enough outputs to mix with';
          }
      }
      let keys = {
          view: {
              pub: pub_keys.view,
              sec: sec_keys.view
          },
          spend: {
              pub: pub_keys.spend,
              sec: sec_keys.spend
          }
      };
      if (!this.valid_keys(keys.view.pub, keys.view.sec, keys.spend.pub, keys.spend.sec)) {
        console.log('Invalid secret keys!');
          throw "Invalid secret keys!";
      }
      let needed_money = JSBigInt.ZERO;
      for (i = 0; i < dsts.length; ++i) {
          needed_money = needed_money.add(dsts[i].amount);
          if (needed_money.compare(this.UINT64_MAX) !== -1) {
            console.log('Output overflow!');
              throw "Output overflow!";
          }
      }
      let found_money = JSBigInt.ZERO;
      let sources = [];
      console.log('Selected transfers: ', outputs);
      for (i = 0; i < outputs.length; ++i) {
          found_money = found_money.add(outputs[i].amount);
          if (found_money.compare(this.UINT64_MAX) !== -1) {
              throw "Input overflow!";
          }
          let src = {
              outputs: [],
              amount:null,
              real_out_tx_key:null,
              real_out:null,
              real_out_in_tx:null,
              mask:null
          };
          src.amount = JSBigInt(outputs[i].amount,null).toString();
          if (mix_outs.length !== 0) {
              // Sort fake outputs by global index
              mix_outs[i].outputs.sort(function(a, b) {
                  return JSBigInt(a.global_index).compare(b.global_index);
              });
              j = 0;
              while ((src.outputs.length < fake_outputs_count) && (j < mix_outs[i].outputs.length)) {
                  let out = mix_outs[i].outputs[j];
                  if (out.global_index === outputs[i].global_index) {
                      console.log('got mixin the same as output, skipping');
                      j++;
                      continue;
                  }
                  let oe = {
                    index : out.global_index.toString(),
                    key : out.public_key,
                    commit:null
                  };
         
                  if (rct){
                      if (out.rct){
                          oe.commit = out.rct.slice(0,64); //add commitment from rct mix outs
                      } else {
                          if (outputs[i].rct) {throw "mix rct outs missing commit";}
                          oe.commit = this.zeroCommit(this.d2s(src.amount)); //create identity-masked commitment for non-rct mix input
                      }
                  }
                  src.outputs.push(oe);
                  j++;
              }
          }
          let real_oe = {
            index: JSBigInt(outputs[i].global_index || 0,null).toString(),
            key: outputs[i].public_key,
            commit:null,

          };

          if (rct){
              if (outputs[i].rct) {
                  real_oe.commit = outputs[i].rct.slice(0,64); //add commitment for real input
              } else {
                  real_oe.commit = this.zeroCommit(this.d2s(src.amount)); //create identity-masked commitment for non-rct input
              }
          }
          let real_index = src.outputs.length;
          for (j = 0; j < src.outputs.length; j++) {
              if (JSBigInt(real_oe.index,null).compare(src.outputs[j].index) < 0) {
                  real_index = j;
                  break;
              }
          }
          // Add real_oe to outputs
          src.outputs.splice(real_index, 0, real_oe);
          src.real_out_tx_key = outputs[i].tx_pub_key;
          // Real output entry index
          src.real_out = real_index;
          src.real_out_in_tx = outputs[i].index;
          if (rct){
              if (outputs[i].rct) {
                  src.mask = outputs[i].rct.slice(64,128); //encrypted or idenity mask for coinbase txs.
              } else {
                  src.mask = null; //will be set by generate_key_image_helper_rct
              }
          }
          sources.push(src);
      }
      console.log('sources: ', sources);
      let change = {
          amount: JSBigInt.ZERO
      };
      let cmp = needed_money.compare(found_money);
      if (cmp < 0) {
          change.amount = found_money.subtract(needed_money);
          if (change.amount.compare(fee_amount) !== 0) {
              throw "early fee calculation != later";
          }
      } else if (cmp > 0) {
          throw "Need more money than found! (have: " + this.formatMoney(found_money) + " need: " + this.formatMoney(needed_money) + ")";
      }
      return this.construct_tx(keys, sources, dsts, fee_amount, payment_id, pid_encrypt, realDestViewKey, unlock_time, rct);
  };

  estimateRctSize (inputs, mixin, outputs) {
      let size = 0;
      size += outputs * 6306;
      size += ((mixin + 1) * 4 + 32 + 8) * inputs; //key offsets + key image + amount
      size += 64 * (mixin + 1) * inputs + 64 * inputs; //signature + pseudoOuts/cc
      size += 74; //extra + whatever, assume long payment ID
      return size;
  };

  trimRight(str, char) {
      while (str[str.length - 1] == char) str = str.slice(0, -1);
      return str;
  }

  padLeft(str, len, char) {
      while (str.length < len) {
          str = char + str;
      }
      return str;
  }

  printDsts (dsts) {
      for (let i = 0; i < dsts.length; i++) {
          console.log(dsts[i].address + ': ' + this.formatMoneyFull(dsts[i].amount));
      }
  };

  formatMoneyFull (units) {
      units = units.toString();
      let symbol = units[0] === '-' ? '-' : '';
      if (symbol === '-') {
          units = units.slice(1);
      }
      let decimal;
      if (units.length >= this.config.coinUnitPlaces) {
          decimal = units.substr(units.length - this.config.coinUnitPlaces, this.config.coinUnitPlaces);
      } else {
          decimal = this.padLeft(units, this.config.coinUnitPlaces, '0');
      }
      return symbol + (units.substr(0, units.length - this.config.coinUnitPlaces) || '0') + '.' + decimal;
  };

  formatMoneyFullSymbol (units) {
      return this.formatMoneyFull(units) + ' ' + this.config.coinSymbol;
  };

  formatMoney (units) {
      let f = this.trimRight(this.formatMoneyFull(units), '0');
      if (f[f.length - 1] === '.') {
          return f.slice(0, f.length - 1);
      }
      return f;
  };

  formatMoneySymbol (units) {
      return this.formatMoney(units) + ' ' + this.config.coinSymbol;
  };

  parseMoney (str) {
      
      if (!str) return JSBigInt.ZERO;
      let negative = str[0] === '-';
      if (negative) {
          str = str.slice(1);
      }
      let decimalIndex = str.indexOf('.');
      if (decimalIndex == -1) {
          if (negative) {
          return JSBigInt.multiply(str, this.config.coinUnits).negate();
          }
          console.log(this.config.coinUnits);
          return JSBigInt.multiply(str, this.config.coinUnits);
      }
      if (decimalIndex + this.config.coinUnitPlaces + 1 < str.length) {
          str = str.substr(0, decimalIndex + this.config.coinUnitPlaces + 1);
      }
      if (negative) {
          return JSBigInt(str.substr(0, decimalIndex),null).exp10(this.config.coinUnitPlaces)
              .add(JSBigInt(str.substr(decimalIndex + 1),null).exp10(decimalIndex + this.config.coinUnitPlaces - str.length + 1)).negate;
      }
      
      return JSBigInt(str.substr(0, decimalIndex),null).exp10(this.config.coinUnitPlaces)
          .add(JSBigInt(str.substr(decimalIndex + 1),null).exp10(decimalIndex + this.config.coinUnitPlaces - str.length + 1));
  };

  decompose_amount_into_digits (amount) {
      /*if (dust_threshold === undefined) {
       dust_threshold = this.config.dustThreshold;
       }*/
      amount = amount.toString();
      let ret = [];
      while (amount.length > 0) {
          //split all the way down since v2 fork
          /*let remaining = JSBigInt(amount);
           if (remaining.compare(this.config.dustThreshold) <= 0) {
           if (remaining.compare(0) > 0) {
           ret.push(remaining);
           }
           break;
           }*/
          //check so we don't create 0s
          if (amount[0] !== "0"){
              let digit = amount[0];
              while (digit.length < amount.length) {
                  digit += "0";
              }
              ret.push(JSBigInt(digit,null));
          }
          amount = amount.slice(1);
      }
      return ret;
  };

  decompose_tx_destinations (dsts, rct) {
      let out = [];
      if (rct) {
          for (let i = 0; i < dsts.length; i++) {
              out.push({
                  address: dsts[i].address,
                  amount: dsts[i].amount
              });
          }
      } else {
          for (let i = 0; i < dsts.length; i++) {
              let digits = this.decompose_amount_into_digits(dsts[i].amount);
              for (let j = 0; j < digits.length; j++) {
                  if (digits[j].compare(0) > 0) {
                      out.push({
                          address: dsts[i].address,
                          amount: digits[j]
                      });
                  }
              }
          }
      }
      return out.sort(function(a,b){
          return a["amount"] - b["amount"];
      });
  };

  is_tx_unlocked (unlock_time, blockchain_height) {
      if (!this.config.maxBlockNumber) {
          throw "Max block number is not set in this.config!";
      }
      if (unlock_time < this.config.maxBlockNumber) {
          // unlock time is block height
          return blockchain_height >= unlock_time;
      } else {
          // unlock time is timestamp
          let current_time = Math.round(new Date().getTime() / 1000);
          return current_time >= unlock_time;
      }
  };

  tx_locked_reason (unlock_time, blockchain_height) {
      if (unlock_time < this.config.maxBlockNumber) {
          // unlock time is block height
          let numBlocks = unlock_time - blockchain_height;
          if (numBlocks <= 0) {
              return "Transaction is unlocked";
          }
          let unlock_prediction = moment().add(numBlocks * this.config.avgBlockTime, 'seconds');
          //return "Will be unlocked in " + numBlocks + " blocks, ~" + unlock_prediction.fromNow(true) + ", " + unlock_prediction.calendar() + "";
          return "Will be unlocked in " + numBlocks + " blocks, ~" + unlock_prediction.fromNow(true);
      } else {
          // unlock time is timestamp
          let current_time = Math.round(new Date().getTime() / 1000);
          let time_difference = unlock_time - current_time;
          if(time_difference <= 0) {
              return "Transaction is unlocked";
          }
          let unlock_moment = moment(unlock_time * 1000);
          //return "Will be unlocked " + unlock_moment.fromNow() + ", " + unlock_moment.calendar();
          return "Will be unlocked " + unlock_moment.fromNow();
      }
  };

  assert(stmt, val) {
      if (!stmt) {
          throw "assert failed" + (val !== undefined ? ': ' + val : '');
      }
  }


}
