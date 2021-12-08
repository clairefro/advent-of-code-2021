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
    this.fuelFn = _fuelReducer;
  }

  histogram() {
    const histogram = {};
    this.positions.map((p) => {
      if (histogram[p]) {
        histogram[p]++;
      } else {
        histogram[p] = 1;
      }
    });
    return histogram;
  }
  calcFuel(pos) {
    const distances = this.positions.map((p) => Math.abs(pos - p));
    const fuel = distances.reduce((a, b) => a + b);
    return fuel;
  }
  max() {
    return Math.max(...this.positions);
  }
  min() {
    return Math.min(...this.positions);
  }
  diff() {
    return this.max() - this.min();
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
  /* These are just for fun */
  average() {
    return Math.floor(
      this.positions.reduce((a, b) => a + b) / this.positions.length
    );
  }
  median() {
    return this.min() + Math.ceil(this.diff() / 2);
  }
  /* End for fun*/
}

const co1 = new CrabOrchestrator(positions);

console.log(co1.optimize());

console.log("## PART 2 #####################");

// x x x x o o o o o o o o o o o o
// 0 0 0 0 1 2 3 4 5 6 7 8 9 101112
