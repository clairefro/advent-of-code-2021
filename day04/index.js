const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

console.log("## PART 1 ###########################");
const calls = raw.split("\n")[0].split(",");

const cardsRaw = raw
  .split(/\n{2}/)
  .slice(1)
  .map((c) => c.split(/\n/))
  .map((c) => c.map((r) => r.split(/\s+/).filter((n) => n !== "")));

class BingoCard {
  callCount = 0;
  winningCall;
  winningScore;
  matrix;
  isBingo = false;

  // rows = [[x,y,z],[a,b,c]...]
  constructor(_rows) {
    // matrix = [[{x: false}, {y: false}...], [{a: false}, {b: false}...]]
    const _matrix = _rows.map((r) => {
      return r.map((n) => ({ [n]: false }));
    });
    this.matrix = _matrix;
  }

  call(n) {
    this.callCount++;
    this.dab(n);
    this.checkIsBingo();
    if (this.isBingo && !this.winningCall) {
      this.winningCall = parseInt(n);
      this.winningScore = this._sumUndabbed() * this.winningCall;
    }
    return this.isBingo;
  }

  // mark n as dabbed (true)
  dab(n) {
    this.matrix.forEach((row) => {
      row.forEach((num) => {
        if (num[n] === false) {
          num[n] = true;
        }
      });
    });
  }

  checkIsBingo() {
    // entire row or column is dabbed
    // rows
    this.matrix.forEach((row) => this._isRowBingo(row));

    // cols
    if (!this.isBingo) {
      const transposed = this.matrix[0].map((_r, i) =>
        this.matrix.map((x) => x[i])
      );
      transposed.forEach((row) => this._isRowBingo(row));
    }
    return this.isBingo;
  }

  _isRowBingo(row) {
    if (!this.isBingo) {
      if (row.every((o) => !!Object.values(o)[0])) {
        return (this.isBingo = true);
      }
    }
    return this.isBingo;
  }

  // = sum of undabbed
  _sumUndabbed() {
    let sumUndabbed = 0;
    this.matrix.forEach((row) => {
      row.forEach((n) => {
        if (!Object.values(n)[0]) {
          sumUndabbed += parseInt(Object.keys(n)[0]);
        }
      });
    });
    return sumUndabbed;
  }
}

const bingoCards = cardsRaw.map((c) => new BingoCard(c));

let bingosReached = [];
calls.forEach((n) => {
  bingoCards.forEach((bc) => {
    const isBingo = bc.call(n);
    if (isBingo && !bc.stop) {
      bc.stop = true;
      bingosReached.push(bc);
    }
  });
});

console.log("bingos reached");
console.log(bingosReached.length);
console.log("last bingo:");
console.log(
  bingosReached.slice(bingosReached.length - 1).map((b, i) => ({
    winningCall: b.winningCall,
    callCnt: b.callCount,
    score: b.winningScore,
  }))
);
