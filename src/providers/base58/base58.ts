import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { BigIntegerProvider } from '../big-integer/big-integer';

declare var JSBigInt;

@Injectable()
export class Base58Provider {

  constructor(
        public http: HttpClient,
        //public bigInt: BigIntegerProvider
    ) {
    for (var i = 0; i < this.alphabet_str.length; i++) {
      this.alphabet.push(this.alphabet_str.charCodeAt(i));
    }
    this.alphabet_size = this.alphabet.length
  }

    b58 = {};

    alphabet_str = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    alphabet = [];
    
    encoded_block_sizes = [0, 2, 3, 5, 6, 7, 9, 10, 11];

    alphabet_size;
    full_block_size = 8;
    full_encoded_block_size = 11;

    UINT64_MAX = JSBigInt(2,null).pow(64);

    hextobin(hex) {
        if (hex.length % 2 !== 0) throw "Hex string has invalid length!";
        var res = new Uint8Array(hex.length / 2);
        for (var i = 0; i < hex.length / 2; ++i) {
            res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }
        return res;
    }

    bintohex(bin) {
        var out = [];
        for (var i = 0; i < bin.length; ++i) {
            out.push(("0" + bin[i].toString(16)).slice(-2));
        }
        return out.join("");
    }

    strtobin(str) {
        var res = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            res[i] = str.charCodeAt(i);
        }
        return res;
    }

    bintostr(bin) {
        var out = [];
        for (var i = 0; i < bin.length; i++) {
            out.push(String.fromCharCode(bin[i]));
        }
        return out.join("");
    }

    uint8_be_to_64(data) {
        if (data.length < 1 || data.length > 8) {
            throw "Invalid input length";
        }
        var res = JSBigInt.ZERO;
        var twopow8 = JSBigInt(2,null).pow(8);
        var i = 0;
        switch (9 - data.length) {
        case 1:
            res = res.add(data[i++]);
        case 2:
            res = res.multiply(twopow8).add(data[i++]);
        case 3:
            res = res.multiply(twopow8).add(data[i++]);
        case 4:
            res = res.multiply(twopow8).add(data[i++]);
        case 5:
            res = res.multiply(twopow8).add(data[i++]);
        case 6:
            res = res.multiply(twopow8).add(data[i++]);
        case 7:
            res = res.multiply(twopow8).add(data[i++]);
        case 8:
            res = res.multiply(twopow8).add(data[i++]);
            break;
        default:
            throw "Impossible condition";
        }
        return res;
    }

    uint64_to_8be(num, size) {
        var res = new Uint8Array(size);
        if (size < 1 || size > 8) {
            throw "Invalid input length";
        }
        var twopow8 = JSBigInt(2,null).pow(8);
        for (var i = size - 1; i >= 0; i--) {
            res[i] = num.remainder(twopow8).toJSValue();
            num = num.divide(twopow8);
        }
        return res;
    }

    encode_block(data, buf, index) {
        if (data.length < 1 || data.length > this.full_encoded_block_size) {
            throw "Invalid block length: " + data.length;
        }
        var num = this.uint8_be_to_64(data);
        var i = this.encoded_block_sizes[data.length] - 1;
        // while num > 0
        while (num.compare(0) === 1) {
            var div = num.divRem(this.alphabet_size);
            // remainder = num % alphabet_size
            var remainder = div[1];
            // num = num / alphabet_size
            num = div[0];
            buf[index + i] = this.alphabet[remainder.toJSValue()];
            i--;
        }
        return buf;
    }

    encode(hex) {
        var data = this.hextobin(hex);
        if (data.length === 0) {
            return "";
        }
        var full_block_count = Math.floor(data.length / this.full_block_size);
        var last_block_size = data.length % this.full_block_size;
        var res_size = full_block_count * this.full_encoded_block_size + this.encoded_block_sizes[last_block_size];

        var res = new Uint8Array(res_size);
        var i;
        for (i = 0; i < res_size; ++i) {
            res[i] = this.alphabet[0];
        }
        for (i = 0; i < full_block_count; i++) {
            res = this.encode_block(data.subarray(i * this.full_block_size, i * this.full_block_size + this.full_block_size), res, i * this.full_encoded_block_size);
        }
        if (last_block_size > 0) {
            res = this.encode_block(data.subarray(full_block_count * this.full_block_size, full_block_count * this.full_block_size + last_block_size), res, full_block_count * this.full_encoded_block_size)
        }
        return this.bintostr(res);
    }

    decode_block (data, buf, index) {
        if (data.length < 1 || data.length > this.full_encoded_block_size) {
            throw "Invalid block length: " + data.length;
        }

        var res_size = this.encoded_block_sizes.indexOf(data.length);
        if (res_size <= 0) {
            throw "Invalid block size";
        }
        var res_num = JSBigInt(0, null);
        var order = JSBigInt(1, null);
        for (var i = data.length - 1; i >= 0; i--) {
            var digit = this.alphabet.indexOf(data[i]);
            if (digit < 0) {
                throw "Invalid symbol";
            }
            var product = order.multiply(digit).add(res_num);
            // if product > UINT64_MAX
            if (product.compare(this.UINT64_MAX) === 1) {
                throw "Overflow";
            }
            res_num = product;
            order = order.multiply(this.alphabet_size);
        }
        if (res_size < this.full_block_size && (JSBigInt(2,null).pow(8 * res_size).compare(res_num) <= 0)) {
            throw "Overflow 2";
        }
        buf.set(this.uint64_to_8be(res_num, res_size), index);
        return buf;
    };

    decode (enc) {
        enc = this.strtobin(enc);
        if (enc.length === 0) {
            return "";
        }
        var full_block_count = Math.floor(enc.length / this.full_encoded_block_size);
        var last_block_size = enc.length % this.full_encoded_block_size;
        var last_block_decoded_size = this.encoded_block_sizes.indexOf(last_block_size);
        if (last_block_decoded_size < 0) {
            throw "Invalid encoded length";
        }
        var data_size = full_block_count * this.full_block_size + last_block_decoded_size;
        var data = new Uint8Array(data_size);
        for (var i = 0; i < full_block_count; i++) {
            data = this.decode_block(enc.subarray(i * this.full_encoded_block_size, i * this.full_encoded_block_size + this.full_encoded_block_size), data, i * this.full_block_size);
        }
        if (last_block_size > 0) {
            data = this.decode_block(enc.subarray(full_block_count * this.full_encoded_block_size, full_block_count * this.full_encoded_block_size + last_block_size), data, full_block_count * this.full_block_size);
        }
        return this.bintohex(data);
    };


}
