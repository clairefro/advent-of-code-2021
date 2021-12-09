const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

// split and sort each input/output characters alphabetically
const entries = raw
  .split("\n")
  .map((e) => e.split("|"))
  .map((e) => {
    const inputs = e[0].match(/\b(\w+)\b/g).map((i) =>
      i
        .split("")
        .sort((a, b) => {
          return a < b ? -1 : a > b ? 1 : 0;
        })
        .join("")
    );
    const outputs = e[1].match(/\b(\w+)\b/g).map((o) =>
      o
        .split("")
        .sort((a, b) => {
          return a < b ? -1 : a > b ? 1 : 0;
        })
        .join("")
    );
    return [inputs, outputs];
  });

// 0 => 6
//*1 => 2*
// 2 => 5
// 3 => 5
//*4 => 4*
// 5 => 5
// 6 => 6
//*7 => 3*
//*8 => 7*
// 9 => 6

console.log("## PART 1 #####################");

const outputs = entries.map((e) => e[1]);

const histogram = {};
outputs.forEach((o) => {
  o.forEach((digit) => {
    const len = digit.length;
    if (histogram[len]) {
      histogram[len]++;
    } else {
      histogram[len] = 1;
    }
  });
});

console.log({ histogram });

console.log("## PART 2 #####################");
const inputs = entries.map((e) => e[0]);
// a
// b - !c, !f
// c - c,f
// d - !c, !f
// e
// f - c,f
// g - a

//      0=a
//  1=b      2=c
//      3=d
//  4=e      5=f
//      6=g

// stoke to digit
// a => [0,  2,3,  5,6,7,8, ]
// b => [0,      4,5,6,  8,9]
// c => [  1,2,3,4,    7,8,9]
// d => [    2,3,4,5,6,  8,9]
// e => [0,  2,      6,  8  ]
// f => [0,1,  3,4,5,6,7,8,9]
// g => [0,  2,3,  5,6,  8,9]
// --------------------------
// cnt   5,2,5,5,4,5,6,3,7,5

// 0 => [a,b,c,  e,f,g] : 6
// 1 => [    c,    f  ] : 2
// 2 => [a,  c,d,e  ,g] : 5
// 3 => [a,  c,d,  f,g] : 5
// 4 => [  b,c,d,  f  ] : 4
// 5 => [a,b,  d,  f,g] : 5
// 6 => [a,b,  d,e,f,g] : 6
// 7 => [a,  c,    f  ] : 3
// 8 => [a,b,c,d,e,f,g] : 7
// 9 => [a,b,c,d,  f,g] : 6

// 2 is only number without f

// 1 // find 1 (only one with 2 strokes)
// 3 // digit with stroke cnt 5 that countains strokes from 1 is 3
// 4 // find 4 (only one with 4 stokes)
// b // stroke that exists in 4 and not 3 is b
// d // stroke that exists in 4 and not 1 or b is d
// 0 // find 0 (stroke cnt 6 with no d)
// 5 // find 5 (stroke cnt 5 where not 3 and !!b and only one stroke from 1 exists)
// 2 // find 2 (stroke cnt 5, only remaining)

// 7 // find 7 (only one with 3 strokes)
// 8 // find 8 (only with 7 strokes)
// a // stroke that exists in 7 and not 1 is a
// 9 // find 9 (stoke count 6 contains all the strokes from 4)
// 6 // last remaining

// stroke that exists in 1 and not 2 is f

// stroke cnt 3 is only 7
// stroke cnt 7 is only 8

// 1(2),4(4),7(3),8(7) <-- distinct stroke cnt
class Deducer {
  cipher = {};
  decipher = {};
  inputs;
  b;
  d;
  constructor(_inputs) {
    this.inputs = _inputs;
    this._deduce();
  }

  _strokes(d) {
    return d.length;
  }
  _findWhereStrokes(n) {
    return this.inputs.filter((i) => this._strokes(i) === n);
  }
  _onlyInX(x, y) {
    const re = new RegExp(`[^${y}]`, "g");
    let onlyX = x.match(re);
    return onlyX;
  }
  _sort(a, b) {
    return [a, b].sort((a, b) => a.length - b.length);
  }
  // return true if a and b completely overlap strokes
  _overlaps(a, b) {
    const [short, long] = this._sort(a, b);
    const shortStrokes = short.split("");
    const longStrokes = long.split("");
    const isOverlap = shortStrokes.every((s) => longStrokes.includes(s));
    return isOverlap;
  }
  _deduce() {
    // 1 // find 1 (only one with 2 strokes)
    this.cipher[1] = this._findWhereStrokes(2)[0];
    // 3 // digit with stroke cnt 5 that countains strokes from 1 is 3
    const three = this.inputs.filter(
      (i) => this._strokes(i) === 5 && this._overlaps(i, this.getCipher(1))
    )[0];
    this.cipher[3] = three;
    // 4 // find 4 (only one with 4 stokes)
    this.cipher[4] = this._findWhereStrokes(4)[0];
    // b // stroke that exists in 4 and not 3 is b
    this.b = this._onlyInX(this.getCipher(4), this.getCipher(3))[0];
    // d // stroke that exists in 4 and not 1 or b is d
    this.d = this._onlyInX(this.getCipher(4), this.getCipher(1) + this.b)[0];
    // 0 // find 0 (stroke cnt 6 with no d)
    this.cipher[0] = this._findWhereStrokes(6).find((i) => !i.includes(this.d));
    // 5 // find 5 (stroke cnt 5 where not 3 and !!b and only one stroke from 1 exists)
    this.cipher[5] = this._findWhereStrokes(5)
      .filter((i) => i !== this.getCipher(3))
      .filter((i) => i.split("").includes(this.b))
      .filter((i) => {
        const one = this.getCipher(1);
        const isValid =
          (i.split("").includes(one[0]) || i.split("").includes(one[1])) &&
          !(i.split("").includes(one[0]) && i.split("").includes(one[1]));
        return isValid;
      })[0];
    // 2 // find 2 (stroke cnt 5, only remaining)
    this.cipher[2] = this._findWhereStrokes(5).filter(
      (i) => !Object.values(this.cipher).includes(i)
    )[0];
    // 7 // find 7 (only one with 3 strokes)
    this.cipher[7] = this._findWhereStrokes(3)[0];
    // 8 // find 8 (only with 7 strokes)
    this.cipher[8] = this._findWhereStrokes(7)[0];
    // 9 // find 9 (stroke count 6 contains all the strokes from 4)
    this.cipher[9] = this._findWhereStrokes(6).filter((i) =>
      this._overlaps(i, this.getCipher(4))
    )[0];
    // 6 // last remaining
    this.cipher[6] = this.inputs.filter(
      (i) => !Object.values(this.cipher).includes(i)
    )[0];
    // a // stroke that exists in 7 and not 1 is a

    Object.entries(this.cipher).forEach(([k, v]) => {
      this.decipher[v] = k;
    });
  }
  getCipher(n) {
    return this.cipher[n];
  }
  getDigit(input) {
    return this.decipher[input];
  }
}

let sum = 0;

entries.forEach((e) => {
  const [_inputs, _outputs] = e;
  const d = new Deducer(_inputs);
  const digits = parseInt(_outputs.map((o) => d.getDigit(o)).join(""));
  sum += digits;
});

console.log(sum);
