const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

console.log("## PART 1 ###########################");

// Calculate submarines final horizontal and depth position

let input = raw
  .split("\n")
  .map((i) => i.split(" "))
  .map((i) => [i[0], parseInt(i[1])]);

class BasicTracker {
  horizontal = 0;
  depth = 0;

  ops = {
    forward: (n) => {
      this.horizontal += n;
    },
    down: (n) => {
      this.depth += n;
    },
    up: (n) => {
      this.depth -= n;
    },
  };

  track([op, n]) {
    const fn = this.ops[op];
    if (!fn) {
      console.warn(`No op found for '${op}'`);
      return;
    }
    fn(n);
  }
}

const pt1 = new BasicTracker();

input.forEach((i) => {
  pt1.track(i);
});

console.log("Final horizontal: ", pt1.horizontal);
console.log("Final depth: ", pt1.depth);
console.log("Product: ", pt1.depth * pt1.horizontal);

console.log("## PART 2 ###########################");

// Now with aim

class AimTracker {
  horizontal = 0;
  aim = 0;
  depth = 0;

  ops = {
    forward: (n) => {
      this.horizontal += n;
      this.depth += n * this.aim;
    },
    down: (n) => {
      this.aim += n;
    },
    up: (n) => {
      this.aim -= n;
    },
  };

  track([op, n]) {
    const fn = this.ops[op];
    if (!fn) {
      console.warn(`No op found for '${op}'`);
      return;
    }
    fn(n);
  }
}

const pt2 = new AimTracker();

input.forEach((i) => {
  pt2.track(i);
});

console.log("Final horizontal: ", pt2.horizontal);
console.log("Final depth: ", pt2.depth);
console.log("Product: ", pt2.depth * pt2.horizontal);
