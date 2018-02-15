import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BigIntegerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BigIntegerProvider {
  CONSTRUCT = {};
  BigInteger_base = 10000000;
  BigInteger_base_log10 = 7;
  
  base = this.BigInteger_base;
  base_log10 = this.BigInteger_base_log10;
  
  ZERO = this.BigInteger([], 0, this.CONSTRUCT);
  ONE = this.BigInteger([1], 1, this.CONSTRUCT);
  M_ONE = this.BigInteger(this.ONE._d, -1, this.CONSTRUCT);
  _0 = this.ZERO;
  _1 = this.ONE;
  small = [
      this.ZERO,
      this.ONE,
      /* Assuming this.BigInteger_base > 36 */
      this.BigInteger( [2], 1, this.CONSTRUCT),
      this.BigInteger( [3], 1, this.CONSTRUCT),
      this.BigInteger( [4], 1, this.CONSTRUCT),
      this.BigInteger( [5], 1, this.CONSTRUCT),
      this.BigInteger( [6], 1, this.CONSTRUCT),
      this.BigInteger( [7], 1, this.CONSTRUCT),
      this.BigInteger( [8], 1, this.CONSTRUCT),
      this.BigInteger( [9], 1, this.CONSTRUCT),
      this.BigInteger([10], 1, this.CONSTRUCT),
      this.BigInteger([11], 1, this.CONSTRUCT),
      this.BigInteger([12], 1, this.CONSTRUCT),
      this.BigInteger([13], 1, this.CONSTRUCT),
      this.BigInteger([14], 1, this.CONSTRUCT),
      this.BigInteger([15], 1, this.CONSTRUCT),
      this.BigInteger([16], 1, this.CONSTRUCT),
      this.BigInteger([17], 1, this.CONSTRUCT),
      this.BigInteger([18], 1, this.CONSTRUCT),
      this.BigInteger([19], 1, this.CONSTRUCT),
      this.BigInteger([20], 1, this.CONSTRUCT),
      this.BigInteger([21], 1, this.CONSTRUCT),
      this.BigInteger([22], 1, this.CONSTRUCT),
      this.BigInteger([23], 1, this.CONSTRUCT),
      this.BigInteger([24], 1, this.CONSTRUCT),
      this.BigInteger([25], 1, this.CONSTRUCT),
      this.BigInteger([26], 1, this.CONSTRUCT),
      this.BigInteger([27], 1, this.CONSTRUCT),
      this.BigInteger([28], 1, this.CONSTRUCT),
      this.BigInteger([29], 1, this.CONSTRUCT),
      this.BigInteger([30], 1, this.CONSTRUCT),
      this.BigInteger([31], 1, this.CONSTRUCT),
      this.BigInteger([32], 1, this.CONSTRUCT),
      this.BigInteger([33], 1, this.CONSTRUCT),
      this.BigInteger([34], 1, this.CONSTRUCT),
      this.BigInteger([35], 1, this.CONSTRUCT),
      this.BigInteger([36], 1, this.CONSTRUCT)
  ];
  _d:any;
  _s:any;
  // Used for parsing/radix conversion
  digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  constructor(
    public http: HttpClient
  ) {
  }

  
  BigInteger(n, s, token) {
      if (token !== this.CONSTRUCT) {
          if (n instanceof BigIntegerProvider) {
              return n;
          }
          else if (typeof n === null) {
              return this.ZERO;
          }
          return this.parse(n, null);
      }
  
      n = n || [];  // Provide the nullary this.CONSTRUCTor for subclasses.
      while (n.length && !n[n.length - 1]) {
          --n.length;
      }
      this._d = n;
      this._s = n.length ? (s || 1) : 0;
      return this;
  }
  
  JSBigInt(n, s) {
      let bigInt:any = this.BigInteger(n, s, this.CONSTRUCT);
      return bigInt;
  }
  
  
  

  toString (base) {
      base = +base || 10;
      if (base < 2 || base > 36) {
          throw new Error("illegal radix " + base + ".");
      }
      if (this._s === 0) {
          return "0";
      }
      if (base === 10) {
          let str = this._s < 0 ? "-" : "";
          str += this._d[this._d.length - 1].toString();
          for (let i = this._d.length - 2; i >= 0; i--) {
              let group = this._d[i].toString();
              while (group.length < this.BigInteger_base_log10) group = '0' + group;
              str += group;
          }
          return str;
      }
      else {
          let numerals = this.digits;
          base = this.small[base];
          let sign = this._s;
  
          let n = this.abs();
          let digits = [];
          let digit;
  
          while (n._s !== 0) {
            let divmod = n.divRem(base);
              n = divmod[0];
              digit = divmod[1];
              // TODO: This could be changed to unshift instead of reversing at the end.
              // Benchmark both to compare speeds.
              digits.push(numerals[digit.valueOf()]);
          }
          return (sign < 0 ? "-" : "") + digits.reverse().join("");
      }
  }  
  radixRegex = [
      /^$/,
      /^$/,
      /^[01]*$/,
      /^[012]*$/,
      /^[0-3]*$/,
      /^[0-4]*$/,
      /^[0-5]*$/,
      /^[0-6]*$/,
      /^[0-7]*$/,
      /^[0-8]*$/,
      /^[0-9]*$/,
      /^[0-9aA]*$/,
      /^[0-9abAB]*$/,
      /^[0-9abcABC]*$/,
      /^[0-9a-dA-D]*$/,
      /^[0-9a-eA-E]*$/,
      /^[0-9a-fA-F]*$/,
      /^[0-9a-gA-G]*$/,
      /^[0-9a-hA-H]*$/,
      /^[0-9a-iA-I]*$/,
      /^[0-9a-jA-J]*$/,
      /^[0-9a-kA-K]*$/,
      /^[0-9a-lA-L]*$/,
      /^[0-9a-mA-M]*$/,
      /^[0-9a-nA-N]*$/,
      /^[0-9a-oA-O]*$/,
      /^[0-9a-pA-P]*$/,
      /^[0-9a-qA-Q]*$/,
      /^[0-9a-rA-R]*$/,
      /^[0-9a-sA-S]*$/,
      /^[0-9a-tA-T]*$/,
      /^[0-9a-uA-U]*$/,
      /^[0-9a-vA-V]*$/,
      /^[0-9a-wA-W]*$/,
      /^[0-9a-xA-X]*$/,
      /^[0-9a-yA-Y]*$/,
      /^[0-9a-zA-Z]*$/
  ];

  expandExponential(str) {
    str = str.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/, "e");

    return str.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/, function(x, s, n, f, c) {
        this.c = +c;
        this.l = c < 0;
        this.i = n.length + c;
        x = (this.l ? n : f).length;
        c = ((c = Math.abs(c)) >= x ? c - x + this.l : 0);
        this.z = (new Array(c + 1)).join("0");
        this.r = n + f;
        return (s || "") + (this.l ? this.r = this.z + this.r : this.r += this.z).substr(0, this.i += this.l ? this.z.length : 0) + (this.i < this.r.length ? "." + this.r.substr(this.i) : "");
    });
}
  parse (s, base) {
      // Expands a number in exponential form to decimal form.
      // expandExponential("-13.441*10^5") === "1344100";
      // expandExponential("1.12300e-1") === "0.112300";
      // expandExponential(1000000000000000000000000000000) === "1000000000000000000000000000000";
      
  
      s = s.toString();
      if (typeof base === null || +base === 10) {
          s = this.expandExponential(s);
      }
  
      let prefixRE;
      if (base === null) {
          prefixRE = '0[xcb]';
      }
      else if (base == 16) {
          prefixRE = '0x';
      }
      else if (base == 8) {
          prefixRE = '0c';
      }
      else if (base == 2) {
          prefixRE = '0b';
      }
      else {
          prefixRE = '';
      }
      let parts = new RegExp('^([+\\-]?)(' + prefixRE + ')?([0-9a-z]*)(?:\\.\\d*)?$', 'i').exec(s);
      if (parts) {
          let sign:any = parts[1] || "+";
          let baseSection:any = parts[2] || "";
          let digits:any = parts[3] || "";
  
          if (base === null) {
              // Guess base
              if (baseSection === "0x" || baseSection === "0X") { // Hex
                  base = 16;
              }
              else if (baseSection === "0c" || baseSection === "0C") { // Octal
                  base = 8;
              }
              else if (baseSection === "0b" || baseSection === "0B") { // Binary
                  base = 2;
              }
              else {
                  base = 10;
              }
          }
          else if (base < 2 || base > 36) {
              throw new Error("Illegal radix " + base + ".");
          }
  
          base = +base;
  
          // Check for digits outside the range
          if (!(this.radixRegex[base].test(digits))) {
              throw new Error("Bad digit for radix " + base);
          }
  
          // Strip leading zeros, and convert to array
          digits = digits.replace(/^0+/, "").split("");
          if (digits.length === 0) {
              return this.ZERO;
          }
  
          // Get the sign (we know it's not zero)
          sign = (sign === "-") ? -1 : 1;
  
          // Optimize 10
          if (base == 10) {
              let d = [];
              while (digits.length >= this.BigInteger_base_log10) {
                  d.push(parseInt(digits.splice(digits.length-this.base_log10, this.base_log10).join(''), 10));
              }
              d.push(parseInt(digits.join(''), 10));
              return this.BigInteger(d, sign, this.CONSTRUCT);
          }
  
          // Do the conversion
          let d = this.ZERO;
          base = this.small[base];
          let small = this.small;
          for (let i = 0; i < digits.length; i++) {
              d = d.multiply(base).add(small[parseInt(digits[i], 36)]);
          }
          return this.BigInteger(d._d, sign, this.CONSTRUCT);
      }
      else {
          throw new Error("Invalid BigInteger format: " + s);
      }
  }
  
  add (n) {
      if (this._s === 0) {
          this.BigInteger(n,null,null);
      }
  
      n = this.BigInteger(n,null,null);
      if (n._s === 0) {
          return this;
      }
      if (this._s !== n._s) {
          n = n.negate();
          return this.subtract(n);
      }
  
      let a = this._d;
      let b = n._d;
      let al = a.length;
      let bl = b.length;
      let sum = new Array(Math.max(al, bl) + 1);
      let size = Math.min(al, bl);
      let carry = 0;
      let digit;
      let i:any;
      for (i = 0; i < size; i++) {
          digit = a[i] + b[i] + carry;
          sum[i] = digit % this.BigInteger_base;
          carry = (digit / this.BigInteger_base) | 0;
      }
      if (bl > al) {
          a = b;
          al = bl;
      }
      for (i = size; carry && i < al; i++) {
          digit = a[i] + carry;
          sum[i] = digit % this.BigInteger_base;
          carry = (digit / this.BigInteger_base) | 0;
      }
      if (carry) {
          sum[i] = carry;
      }
  
      for ( ; i < al; i++) {
          sum[i] = a[i];
      }
  
      return this.BigInteger(sum, this._s, this.CONSTRUCT);
  }
  
  /*
      Function: negate
      Get the additive inverse of a <BigInteger>.
  
      Returns:
  
          A <BigInteger> with the same magnatude, but with the opposite sign.
  
      See Also:
  
          <abs>
  */
  negate() {
      return this.BigInteger(this._d, (-this._s) | 0, this.CONSTRUCT);
  }
  
  /*
      Function: abs
      Get the absolute value of a <BigInteger>.
  
      Returns:
  
          A <BigInteger> with the same magnatude, but always positive (or zero).
  
      See Also:
  
          <negate>
  */
  abs () {
      return (this._s < 0) ? this.negate() : this;
  }
  
  /*
      Function: subtract
      Subtract two <BigIntegers>.
  
      Parameters:
  
          n - The number to subtract from *this*. Will be converted to a <BigInteger>.
  
      Returns:
  
          The *n* subtracted from *this*.
  
      See Also:
  
          <add>, <multiply>, <quotient>, <prev>
  */
  subtract (n) {
      if (this._s === 0) {
          return this.BigInteger(n,null,null).negate();
      }
  
      n = this.BigInteger(n,null,null);
      if (n._s === 0) {
          return this;
      }
      if (this._s !== n._s) {
          n = n.negate();
          return this.add(n);
      }
  
      let m = this;
      // negative - negative => -|a| - -|b| => -|a| + |b| => |b| - |a|
      if (this._s < 0) {
          m = this.BigInteger(n._d, 1, this.CONSTRUCT);
          n = this.BigInteger(this._d, 1, this.CONSTRUCT);
      }
  
      // Both are positive => a - b
      let sign = m.compareAbs(n);
      if (sign === 0) {
          return this.ZERO;
      }
      else if (sign < 0) {
          // swap m and n
          let t = n;
          n = m;
          m = t;
      }
  
      // a > b
      let a = m._d;
      let b = n._d;
      let al = a.length;
      let bl = b.length;
      let diff = new Array(al); // al >= bl since a > b
      let borrow = 0;
      let i;
      let digit;
  
      for (i = 0; i < bl; i++) {
          digit = a[i] - borrow - b[i];
          if (digit < 0) {
              digit += this.BigInteger_base;
              borrow = 1;
          }
          else {
              borrow = 0;
          }
          diff[i] = digit;
      }
      for (i = bl; i < al; i++) {
          digit = a[i] - borrow;
          if (digit < 0) {
              digit += this.BigInteger_base;
          }
          else {
              diff[i++] = digit;
              break;
          }
          diff[i] = digit;
      }
      for ( ; i < al; i++) {
          diff[i] = a[i];
      }
  
      return this.BigInteger(diff, sign, this.CONSTRUCT);
  };
  
      addOne(n, sign) {
        let a = n._d;
        let sum = a.slice();
        let carry = true;
        let i = 0;
  
          while (true) {
            let digit = (a[i] || 0) + 1;
              sum[i] = digit % this.BigInteger_base;
              if (digit <= this.BigInteger_base - 1) {
                  break;
              }
              ++i;
          }
  
          return this.BigInteger(sum, sign, this.CONSTRUCT);
      }
  
      subtractOne(n, sign) {
        let a = n._d;
        let sum = a.slice();
        let borrow = true;
        let i = 0;
  
          while (true) {
            let digit = (a[i] || 0) - 1;
              if (digit < 0) {
                  sum[i] = digit + this.BigInteger_base;
              }
              else {
                  sum[i] = digit;
                  break;
              }
              ++i;
          }
  
          return this.BigInteger(sum, sign, this.CONSTRUCT);
      }
  
      /*
          Function: next
          Get the next <BigInteger> (add one).
  
          Returns:
  
              *this* + 1.
  
          See Also:
  
              <add>, <prev>
      */
      next () {
          switch (this._s) {
          case 0:
              return this.ONE;
          case -1:
              return this.subtractOne(this, -1);
          // case 1:
          default:
              return this.addOne(this, 1);
          }
      }
  
      /*
          Function: prev
          Get the previous <BigInteger> (subtract one).
  
          Returns:
  
              *this* - 1.
  
          See Also:
  
              <next>, <subtract>
      */
      prev () {
          switch (this._s) {
          case 0:
              return this.M_ONE;
          case -1:
              return this.addOne(this, -1);
          // case 1:
          default:
              return this.subtractOne(this, 1);
          }
      };
  
  /*
      Function: compareAbs
      Compare the absolute value of two <BigIntegers>.
  
      Calling <compareAbs> is faster than calling <abs> twice, then <compare>.
  
      Parameters:
  
          n - The number to compare to *this*. Will be converted to a <BigInteger>.
  
      Returns:
  
          -1, 0, or +1 if *|this|* is less than, equal to, or greater than *|n|*.
  
      See Also:
  
          <compare>, <abs>
  */
  compareAbs (n) {
      if (this === n) {
          return 0;
      }
  
      if (!(n instanceof BigIntegerProvider)) {
          if (!isFinite(n)) {
              return(isNaN(n) ? n : -1);
          }
          n = this.BigInteger(n,null,null);
      }
  
      if (this._s === 0) {
          return (n._s !== 0) ? -1 : 0;
      }
      if (n._s === 0) {
          return 1;
      }
  
      let l = this._d.length;
      let nl = n._d.length;
      if (l < nl) {
          return -1;
      }
      else if (l > nl) {
          return 1;
      }
  
      let a = this._d;
      let b = n._d;
      for (let i = l-1; i >= 0; i--) {
          if (a[i] !== b[i]) {
              return a[i] < b[i] ? -1 : 1;
          }
      }
  
      return 0;
  };
  
  /*
      Function: compare
      Compare two <BigIntegers>.
  
      Parameters:
  
          n - The number to compare to *this*. Will be converted to a <BigInteger>.
  
      Returns:
  
          -1, 0, or +1 if *this* is less than, equal to, or greater than *n*.
  
      See Also:
  
          <compareAbs>, <isPositive>, <isNegative>, <isUnit>
  */
  compare (n) {
      if (this === n) {
          return 0;
      }
  
      n = this.BigInteger(n,null,null);
  
      if (this._s === 0) {
          return -n._s;
      }
  
      if (this._s === n._s) { // both positive or both negative
          let cmp:any = this.compareAbs(n);
          return cmp * this._s;
      }
      else {
          return this._s;
      }
  };
  
  /*
      Function: isUnit
      Return true iff *this* is either 1 or -1.
  
      Returns:
  
          true if *this* compares equal to <BigInteger.ONE> or <BigInteger.M_ONE>.
  
      See Also:
  
          <isZero>, <isNegative>, <isPositive>, <compareAbs>, <compare>,
          <BigInteger.ONE>, <BigInteger.M_ONE>
  */
  isUnit () {
      return this === this.ONE ||
          this === this.M_ONE ||
          (this._d.length === 1 && this._d[0] === 1);
  };
  
  /*
      Function: multiply
      Multiply two <BigIntegers>.
  
      Parameters:
  
          n - The number to multiply *this* by. Will be converted to a
          <BigInteger>.
  
      Returns:
  
          The numbers multiplied together.
  
      See Also:
  
          <add>, <subtract>, <quotient>, <square>
  */
  multiply (n) {
      // TODO: Consider adding Karatsuba multiplication for large numbers
      if (this._s === 0) {
          return this.ZERO;
      }
  
      n = this.BigInteger(n,null,null);
      if (n._s === 0) {
          return this.ZERO;
      }
      if (this.isUnit()) {
          if (this._s < 0) {
              return n.negate();
          }
          return n;
      }
      if (n.isUnit()) {
          if (n._s < 0) {
              return this.negate();
          }
          return this;
      }
      if (this === n) {
          return this.square();
      }
  
      let r = (this._d.length >= n._d.length);
      let a = (r ? this : n)._d; // a will be longer than b
      let b = (r ? n : this)._d;
      let al = a.length;
      let bl = b.length;
  
      let pl = al + bl;
      let partial = new Array(pl);
      let i;
      for (i = 0; i < pl; i++) {
          partial[i] = 0;
      }
  
      for (i = 0; i < bl; i++) {
        let carry = 0;
        let bi = b[i];
        let jlimit = al + i;
        let digit, j;
          for (j = i; j < jlimit; j++) {
              digit = partial[j] + bi * a[j - i] + carry;
              carry = (digit / this.BigInteger_base) | 0;
              partial[j] = (digit % this.BigInteger_base) | 0;
          }
          if (carry) {
              digit = partial[j] + carry;
              carry = (digit / this.BigInteger_base) | 0;
              partial[j] = digit % this.BigInteger_base;
          }
      }
      return this.BigInteger(partial, this._s * n._s, this.CONSTRUCT);
  };
  
  // Multiply a BigInteger by a single-digit native number
  // Assumes that this and n are >= 0
  // This is not really intended to be used outside the library itself
  multiplySingleDigit (n) {
      if (n === 0 || this._s === 0) {
          return this.ZERO;
      }
      if (n === 1) {
          return this;
      }
  
      let digit;
      if (this._d.length === 1) {
          digit = this._d[0] * n;
          if (digit >= this.BigInteger_base) {
              return this.BigInteger([(digit % this.BigInteger_base)|0,
                      (digit / this.BigInteger_base)|0], 1, this.CONSTRUCT);
          }
          return this.BigInteger([digit], 1, this.CONSTRUCT);
      }
  
      if (n === 2) {
          return this.add(this);
      }
      if (this.isUnit()) {
          return this.BigInteger([n], 1, this.CONSTRUCT);
      }
  
      let a = this._d;
      let al = a.length;
  
      let pl = al + 1;
      let partial = new Array(pl);
      for (let i = 0; i < pl; i++) {
          partial[i] = 0;
      }
  
      let carry = 0;
      let j:any;
      for (j = 0; j < al; j++) {
          digit = n * a[j] + carry;
          carry = (digit / this.BigInteger_base) | 0;
          partial[j] = (digit % this.BigInteger_base) | 0;
      }
      if (carry) {
          partial[j] = carry;
      }
  
      return this.BigInteger(partial, 1, this.CONSTRUCT);
  };
  
  /*
      Function: square
      Multiply a <BigInteger> by itself.
  
      This is slightly faster than regular multiplication, since it removes the
      duplicated multiplcations.
  
      Returns:
  
          > this.multiply(this)
  
      See Also:
          <multiply>
  */
  square () {
      // Normally, squaring a 10-digit number would take 100 multiplications.
      // Of these 10 are unique diagonals, of the remaining 90 (100-10), 45 are repeated.
      // This procedure saves (N*(N-1))/2 multiplications, (e.g., 45 of 100 multiplies).
      // Based on code by Gary Darby, Intellitech Systems Inc., www.DelphiForFun.org
  
      if (this._s === 0) {
          return this.ZERO;
      }
      if (this.isUnit()) {
          return this.ONE;
      }
  
      let digits = this._d;
      let length = digits.length;
      let imult1 = new Array(length + length + 1);
      let product, carry, k;
      let i;
  
      // Calculate diagonal
      for (i = 0; i < length; i++) {
          k = i * 2;
          product = digits[i] * digits[i];
          carry = (product / this.BigInteger_base) | 0;
          imult1[k] = product % this.BigInteger_base;
          imult1[k + 1] = carry;
      }
  
      // Calculate repeating part
      for (i = 0; i < length; i++) {
          carry = 0;
          k = i * 2 + 1;
          for (let j = i + 1; j < length; j++, k++) {
              product = digits[j] * digits[i] * 2 + imult1[k] + carry;
              carry = (product / this.BigInteger_base) | 0;
              imult1[k] = product % this.BigInteger_base;
          }
          k = length + i;
          let digit = carry + imult1[k];
          carry = (digit / this.BigInteger_base) | 0;
          imult1[k] = digit % this.BigInteger_base;
          imult1[k + 1] += carry;
      }
  
      return this.BigInteger(imult1, 1, this.CONSTRUCT);
  };
  
  /*
      Function: quotient
      Divide two <BigIntegers> and truncate towards zero.
  
      <quotient> throws an exception if *n* is zero.
  
      Parameters:
  
          n - The number to divide *this* by. Will be converted to a <BigInteger>.
  
      Returns:
  
          The *this* / *n*, truncated to an integer.
  
      See Also:
  
          <add>, <subtract>, <multiply>, <divRem>, <remainder>
  */
  quotient (n) {
      return this.divRem(n)[0];
  }
  
  /*
      Function: divide
      Deprecated synonym for <quotient>.
  */
  divide = this.quotient;
  
  /*
      Function: remainder
      Calculate the remainder of two <BigIntegers>.
  
      <remainder> throws an exception if *n* is zero.
  
      Parameters:
  
          n - The remainder after *this* is divided *this* by *n*. Will be
              converted to a <BigInteger>.
  
      Returns:
  
          *this* % *n*.
  
      See Also:
  
          <divRem>, <quotient>
  */
  remainder (n) {
      return this.divRem(n)[1];
  };
  
  /*
      Function: divRem
      Calculate the integer quotient and remainder of two <BigIntegers>.
  
      <divRem> throws an exception if *n* is zero.
  
      Parameters:
  
          n - The number to divide *this* by. Will be converted to a <BigInteger>.
  
      Returns:
  
          A two-element array containing the quotient and the remainder.
  
          > a.divRem(b)
  
          is exactly equivalent to
  
          > [a.quotient(b), a.remainder(b)]
  
          except it is faster, because they are calculated at the same time.
  
      See Also:
  
          <quotient>, <remainder>
  */
  divRem (n) {
      n = this.BigInteger(n,null,null);
      if (n._s === 0) {
          throw new Error("Divide by zero");
      }
      if (this._s === 0) {
          return [this.ZERO, this.ZERO];
      }
      if (n._d.length === 1) {
   
          return this.divRemSmall(n._s * n._d[0]);
      }
      // Test for easy cases -- |n1| <= |n2|
      switch (this.compareAbs(n)) {
      case 0: // n1 == n2
          return [this._s === n._s ? this.ONE : this.M_ONE, this.ZERO];
      case -1: // |n1| < |n2|
          return [this.ZERO, this];
      }
  
      let sign = this._s * n._s;
      let a = n.abs();
      let b_digits = this._d;
      let b_index = b_digits.length;
      let digits = n._d.length;
      let quot = [];
      let guess;
  
      let part = this.BigInteger([], 0, this.CONSTRUCT);
      let check:any;
      while (b_index) {
          part._d.unshift(b_digits[--b_index]);
          part = this.BigInteger(part._d, 1, this.CONSTRUCT);
  
          if (part.compareAbs(n) < 0) {
              quot.push(0);
              continue;
          }
          if (part._s === 0) {
              guess = 0;
          }
          else {
            let xlen = part._d.length, ylen = a._d.length;
            let highx = part._d[xlen-1]*this.BigInteger_base + part._d[xlen-2];
            let highy = a._d[ylen-1]*this.BigInteger_base + a._d[ylen-2];
              if (part._d.length > a._d.length) {
                  // The length of part._d can either match a._d length,
                  // or exceed it by one.
                  highx = (highx+1)*this.BigInteger_base;
              }
              guess = Math.ceil(highx/highy);
          }
          do {
            let check = a.multiplySingleDigit(guess);
              if (check.compareAbs(part) <= 0) {
                  break;
              }
              guess--;
          } while (guess);
  
          quot.push(guess);
          if (!guess) {
              continue;
          }
          let diff = part.subtract(check);
          part._d = diff._d.slice();
      }
  
      return [this.BigInteger(quot.reverse(), sign, this.CONSTRUCT),
             this.BigInteger(part._d, this._s, this.CONSTRUCT)];
  };
  
  // Throws an exception if n is outside of (-BigInteger.base, -1] or
  // [1, BigInteger.base).  It's not necessary to call this, since the
  // other division functions will call it if they are able to.
  divRemSmall (n) {
      let r:any;
      n = +n;
      if (n === 0) {
          throw new Error("Divide by zero");
      }
  
      let n_s:any = n < 0 ? -1 : 1;
      let sign = this._s * n_s;
      n = Math.abs(n);
  
      if (n < 1 || n >= this.BigInteger_base) {
          throw new Error("Argument out of range");
      }
      if (this._s === 0) {
          return [this.ZERO, this.ZERO];
      }

      if (n === 1 || n === -1) {
          return [(sign === 1) ? this.abs() : this.BigInteger(this._d, sign, this.CONSTRUCT), this.ZERO];
      }

      // 2 <= n < this.BigInteger_base
  
      // divide a single digit by a single digit
      if (this._d.length === 1) {
          let q = this.BigInteger([(this._d[0] / n) | 0], 1, this.CONSTRUCT);
          let r = this.BigInteger([(this._d[0] % n) | 0], 1, this.CONSTRUCT);
          if (sign < 0) {
              q = q.negate();
          }
          if (this._s < 0) {
              r = r.negate();
          }
          
          return [q, r];
      }

      let digits = this._d.slice();
      let quot = new Array(digits.length);
      let part = 0;
      let diff = 0;
      let i = 0;
      let guess;
  
      while (digits.length) {
          part = part * this.BigInteger_base + digits[digits.length - 1];
          if (part < n) {
              quot[i++] = 0;
              digits.pop();
              diff = this.BigInteger_base * diff + part;
              continue;
          }
          if (part === 0) {
              guess = 0;
          }
          else {
              guess = (part / n) | 0;
          }
  
          let check = n * guess;
          diff = part - check;
          quot[i++] = guess;
          if (!guess) {
              digits.pop();
              continue;
          }
  
          digits.pop();
          part = diff;
      }
  
      r = this.BigInteger([diff], 1, this.CONSTRUCT);
      if (this._s < 0) {
          r = r.negate();
      }
      return [this.BigInteger(quot.reverse(), sign, this.CONSTRUCT), r];
  };
  
  /*
      Function: isEven
      Return true iff *this* is divisible by two.
  
      Note that <BigInteger.ZERO> is even.
  
      Returns:
  
          true if *this* is even, false otherwise.
  
      See Also:
  
          <isOdd>
  */
  isEven () {
      let digits:any = this._d;
      return this._s === 0 || digits.length === 0 || (digits[0] % 2) === 0;
  };
  
  /*
      Function: isOdd
      Return true iff *this* is not divisible by two.
  
      Returns:
  
          true if *this* is odd, false otherwise.
  
      See Also:
  
          <isEven>
  */
  isOdd () {
      return !this.isEven();
  };
  
  /*
      Function: sign
      Get the sign of a <BigInteger>.
  
      Returns:
  
          * -1 if *this* < 0
          * 0 if *this* == 0
          * +1 if *this* > 0
  
      See Also:
  
          <isZero>, <isPositive>, <isNegative>, <compare>, <BigInteger.ZERO>
  */
  sign () {
      return this._s;
  };
  
  /*
      Function: isPositive
      Return true iff *this* > 0.
  
      Returns:
  
          true if *this*.compare(<BigInteger.ZERO>) == 1.
  
      See Also:
  
          <sign>, <isZero>, <isNegative>, <isUnit>, <compare>, <BigInteger.ZERO>
  */
  isPositive () {
      return this._s > 0;
  };
  
  /*
      Function: isNegative
      Return true iff *this* < 0.
  
      Returns:
  
          true if *this*.compare(<BigInteger.ZERO>) == -1.
  
      See Also:
  
          <sign>, <isPositive>, <isZero>, <isUnit>, <compare>, <BigInteger.ZERO>
  */
  isNegative () {
      return this._s < 0;
  };
  
  /*
      Function: isZero
      Return true iff *this* == 0.
  
      Returns:
  
          true if *this*.compare(<BigInteger.ZERO>) == 0.
  
      See Also:
  
          <sign>, <isPositive>, <isNegative>, <isUnit>, <BigInteger.ZERO>
  */
  isZero () {
      return this._s === 0;
  };
  
  /*
      Function: exp10
      Multiply a <BigInteger> by a power of 10.
  
      This is equivalent to, but faster than
  
      > if (n >= 0) {
      >     return this.multiply(BigInteger("1e" + n));
      > }
      > else { // n <= 0
      >     return this.quotient(BigInteger("1e" + -n));
      > }
  
      Parameters:
  
          n - The power of 10 to multiply *this* by. *n* is converted to a
          javascipt number and must be no greater than <BigInteger.MAX_EXP>
          (0x7FFFFFFF), or an exception will be thrown.
  
      Returns:
  
          *this* * (10 ** *n*), truncated to an integer if necessary.
  
      See Also:
  
          <pow>, <multiply>
  */
  exp10 (n) {
      n = +n;
      if (n === 0) {
          return this;
      }
      if (Math.abs(n) > Number(this.MAX_EXP)) {
          throw new Error("exponent too large in BigInteger.exp10");
      }
      // Optimization for this == 0. This also keeps us from having to trim zeros in the positive n case
      if (this._s === 0) {
          return this.ZERO;
      }
      if (n > 0) {
          let k = this.BigInteger(this._d.slice(), this._s, this.CONSTRUCT);
  
          for (; n >= this.BigInteger_base_log10; n -= this.BigInteger_base_log10) {
              k._d.unshift(0);
          }
          if (n == 0)
              return k;
          k._s = 1;
          k = k.multiplySingleDigit(Math.pow(10, n));
          return (this._s < 0 ? k.negate() : k);
      } else if (-n >= this._d.length*this.BigInteger_base_log10) {
          return this.ZERO;
      } else {
          let k = this.BigInteger(this._d.slice(), this._s, this.CONSTRUCT);
  
          for (n = -n; n >= this.BigInteger_base_log10; n -= this.BigInteger_base_log10) {
              k._d.shift();
          }
          return (n == 0) ? k : k.divRemSmall(Math.pow(10, n))[0];
      }
  };
  
  /*
      Function: pow
      Raise a <BigInteger> to a power.
  
      In this implementation, 0**0 is 1.
  
      Parameters:
  
          n - The exponent to raise *this* by. *n* must be no greater than
          <BigInteger.MAX_EXP> (0x7FFFFFFF), or an exception will be thrown.
  
      Returns:
  
          *this* raised to the *nth* power.
  
      See Also:
  
          <modPow>
  */
  pow (n) {
      if (this.isUnit()) {
          if (this._s > 0) {
              return this;
          }
          else {
              return this.BigInteger(n,null,null).isOdd() ? this : this.negate();
          }
      }
  
      n = this.BigInteger(n,null,null);
      if (n._s === 0) {
          return this.ONE;
      }
      else if (n._s < 0) {
          if (this._s === 0) {
              throw new Error("Divide by zero");
          }
          else {
              return this.ZERO;
          }
      }
      if (this._s === 0) {
          return this.ZERO;
      }
      if (n.isUnit()) {
          return this;
      }
  
      if (n.compareAbs(this.MAX_EXP) > 0) {
          throw new Error("exponent too large in BigInteger.pow");
      }
      let x = this;
      let aux = this.ONE;
      let two = this.small[2];
  
      while (n.isPositive()) {
          if (n.isOdd()) {
              aux = aux.multiply(x);
              if (n.isUnit()) {
                  return aux;
              }
          }
          x = x.square();
          n = n.quotient(two);
      }
  
      return aux;
  };
  
  /*
      Function: modPow
      Raise a <BigInteger> to a power (mod m).
  
      Because it is reduced by a modulus, <modPow> is not limited by
      <BigInteger.MAX_EXP> like <pow>.
  
      Parameters:
  
          exponent - The exponent to raise *this* by. Must be positive.
          modulus - The modulus.
  
      Returns:
  
          *this* ^ *exponent* (mod *modulus*).
  
      See Also:
  
          <pow>, <mod>
  */
  modPow (exponent, modulus) {
      let result = this.ONE;
      let base = this;
  
      while (exponent.isPositive()) {
          if (exponent.isOdd()) {
              result = result.multiply(base).remainder(modulus);
          }
  
          exponent = exponent.quotient(this.small[2]);
          if (exponent.isPositive()) {
              base = base.square().remainder(modulus);
          }
      }
  
      return result;
  };
  
  /*
      Function: log
      Get the natural logarithm of a <BigInteger> as a native JavaScript number.
  
      This is equivalent to
  
      > Math.log(this.toJSValue())
  
      but handles values outside of the native number range.
  
      Returns:
  
          log( *this* )
  
      See Also:
  
          <toJSValue>
  */
  log () {
      switch (this._s) {
      case 0:	 return -Infinity;
      case -1: return NaN;
      default: // Fall through.
      }
  
      let l = this._d.length;
  
      if (l*this.BigInteger_base_log10 < 30) {
          return Math.log(this.valueOf());
      }
  
      let N = Math.ceil(30/this.BigInteger_base_log10);
      let firstNdigits = this._d.slice(l - N);
      return Math.log((this.BigInteger(firstNdigits, 1, this.CONSTRUCT)).valueOf()) + (l - N) * Math.log(this.BigInteger_base);
  };
  
  /*
      Function: valueOf
      Convert a <BigInteger> to a native JavaScript integer.
  
      This is called automatically by JavaScipt to convert a <BigInteger> to a
      native value.
  
      Returns:
  
          > parseInt(this.toString(), 10)
  
      See Also:
  
          <toString>, <toJSValue>
  */
  valueOf () {
      return parseInt(this.toString(null), 10);
  };
  
  /*
      Function: toJSValue
      Convert a <BigInteger> to a native JavaScript integer.
  
      This is the same as valueOf, but more explicitly named.
  
      Returns:
  
          > parseInt(this.toString(), 10)
  
      See Also:
  
          <toString>, <valueOf>
  */
  toJSValue () {
      return parseInt(this.toString(null), 10);
  };
  
  

  lowVal  () {
      return this._d[0] || 0;
  }
  
  MAX_EXP = this.BigInteger(0x7FFFFFFF,null,null);
  

      makeUnary(fn) {
          return function(a) {
              return fn.call(this.BigInteger(a,null,null));
          };
      }
  
      makeBinary(fn) {
          return function(a, b) {
              return fn.call(this.BigInteger(a,null,null), this.BigInteger(b,null,null));
          };
      }
  
      makeTrinary(fn) {
          return function(a, b, c) {
              return fn.call(this.BigInteger(a,null,null), this.BigInteger(b,null,null), this.BigInteger(c,null,null));
          };
      }
  
     last(){
          let i, fn;
          let unary = "toJSValue,isEven,isOdd,sign,isZero,isNegative,abs,isUnit,square,negate,isPositive,toString,next,prev,log".split(",");
          let binary = "compare,remainder,divRem,subtract,add,quotient,divide,multiply,pow,compareAbs".split(",");
          let trinary = ["modPow"];
  
          /*for (i = 0; i < unary.length; i++) {
              fn = unary[i];
              this.[fn] = this.makeUnary(this.prototype[fn]);
          }
  
          for (i = 0; i < binary.length; i++) {
              fn = binary[i];
              BigInteger[fn] = this.makeBinary(BigInteger.prototype[fn]);
          }
  
          for (i = 0; i < trinary.length; i++) {
              fn = trinary[i];
              BigInteger[fn] = this.makeTrinary(BigInteger.prototype[fn]);
          }*/
  
      }
      exp10Big (x, n) {
        return this.BigInteger(x,null,null).exp10(n);
    }

  
}
