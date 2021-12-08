const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

const positions = raw.split(",").map((n) => parseInt(n));

console.log("## PART 1 #####################");

// 0 1 2 3 4 5 6 7 8
// x
//         x
//    x
//             x
//    x
//       x

class CrabOrchestrator {
  positions;
  fuelReducer;

  constructor(_positions, _fuelReducer) {
    this.positions = _positions;
    this.fuelReducer = _fuelReducer;
  }
  calcFuel(pos) {
    const fuels = this.positions.map((p) =>
      this.fuelReducer(Math.abs(pos - p))
    );
    const totalFuel = fuels.reduce((a, b) => a + b);
    return totalFuel;
  }
  max() {
    return Math.max(...this.positions);
  }
  min() {
    return Math.min(...this.positions);
  }
  range() {
    const range = [];
    for (let i = this.min(); i <= this.max(); i++) {
      range.push(i);
    }
    return range;
  }
  fuelMap() {
    const map = {};
    this.range().forEach((pos) => {
      const fuel = this.calcFuel(pos);
      map[pos] = fuel;
    });
    return map;
  }
  optimize() {
    const map = this.fuelMap();
    const minFuel = Math.min(...Object.values(map));
    const mins = [];
    Object.entries(map).forEach(([pos, fuel]) => {
      if (fuel === minFuel) {
        mins.push({ pos, fuel });
      }
    });
    return mins;
  }
}

// fuel reducer: 1:1
const fuelReducer1 = (n) => n;
const co1 = new CrabOrchestrator(positions, fuelReducer1);
console.log(co1.optimize((n) => n));

console.log("## PART 2 #####################");
//           |<---------------------------0
// 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
// x x x x x o o o o o o  o  o  o  o  o  x
//           11 10 9 8 7 6 5  4  3  2  1

// fuel reducer: summation
const fuelReducer2 = (n) => (n ** 2 + n) / 2;
const co2 = new CrabOrchestrator(positions, fuelReducer2);
console.log(co2.optimize());
