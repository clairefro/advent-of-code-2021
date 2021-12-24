const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

const splits = raw.split("\n");

// https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array/20798567
function getAllIndexes(arr, val) {
  const indexes = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

const inpIndexes = getAllIndexes(splits, "inp w");
function getCodes(_splits) {
  const codes = [];
  // split into chunks by "inp w"
  const indexes = getAllIndexes(_splits, "inp w");
  indexes.forEach((v, i) => {
    if (!indexes[i + 1]) {
      codes.push(_splits.slice(v));
    } else {
      codes.push(_splits.slice(v, indexes[i + 1] - 1));
    }
  });
  return codes;
}

const codes = getCodes(splits);

// console.log(codes.length);

class Runner {
  vars = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };
  modelNum;
  inpIndex = 0;
  code;
  opCodes = {
    add: (_a, _b) => {
      this.vars[_a] = this.vars[_a] + this.getBVal(_b);
      return this.vars[_a];
    },
    mul: (_a, _b) => {
      this.vars[_a] = this.vars[_a] * this.getBVal(_b);
      return this.vars[_a];
    },
    div: (_a, _b) => {
      this.vars[_a] = Math.floor(this.vars[_a] / this.getBVal(_b));
      return this.vars[_a];
    },
    eql: (_a, _b) => {
      this.vars[_a] = this.vars[_a] === this.getBVal(_b) ? 1 : 0;
      return this.vars[_a];
    },
    mod: (_a, _b) => {
      this.vars[_a] = this.vars[_a] % this.getBVal(_b);
      return this.vars[_a];
    },
    inp: () => {
      // console.log(
      //   "now inputting",
      //   parseInt(this.modelNum.toString()[this.inpIndex])
      // );
      this.vars.w = parseInt(this.modelNum.toString()[this.inpIndex]);
      this.inpIndex++;
    },
  };

  constructor(_code, _modelNum) {
    console.log({ _modelNum });
    this.code = _code;
    this.modelNum = _modelNum;
  }

  getBVal(_b) {
    return this.isNum(_b) ? _b : this.vars[_b];
  }

  reset() {
    Object.keys(this.vars).forEach((k) => (this.vars[k] = 0));
    this.inpIndex = 0;
  }

  parseOp(line) {
    const args = line.split(/\s/);
    return args.map((a) => (this.isNum(a) ? parseInt(a) : a));
  }

  isNum(val) {
    return !isNaN(parseInt(val));
  }

  runLine(line) {
    const args = this.parseOp(line);
    // if (args.length < 3) {
    //   return;
    // }
    const op = this.opCodes[args[0]];
    const a = args[1];
    const b = args[2];
    op(a, b);
  }

  runLines() {
    for (let i = 0; i < this.code.length; i++) {
      // console.log({ line: this.code[i] });
      this.runLine(this.code[i]);
    }
    console.log({ vars: this.vars });
    return this.vars;
  }

  isValid() {
    return this.vars.z === 0;
  }

  // getHighestW() {
  //   const valids = [];
  //   for (let i = 1; i < 10; i++) {
  //     this.runLines(i);
  //     if (this.isValid()) {
  //       valids.push(i);
  //     }
  //     this.reset();
  //   }
  //   return Math.max(...valids);
  // }
}

const valids = [];
// for (let i = 99999999999999; i > 0; i--) {
//   if (!i.toString().match(/0/)) {
//     const r = new Runner(splits, i);
//     r.runLines();
//     console.log({ valid: r.isValid() });
//     if (r.isValid()) {
//       valids.push(i);
//       break;
//     }
//   }
// }
// console.log({ valids });
// console.log(valids[valids.length - 1]);
// for (let i = 0; i < 14; i++) {
//   const code = codes[i];
//   const r = new Runner(code);
//   const digit = r.getHighestW();
//   digits.push(digit);
// }

// console.log(digits.join(""));

const filtered = splits.filter((s) => s.match(/x/) || s.match(/inp/));
// for (let i = 0; i < filtered.length; i += 9) {
//   console.table(filtered.slice(i, i + 9));
// }

console.table(codes, [3]);
