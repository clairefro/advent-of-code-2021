const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

const entries = raw
  .split("\n")
  .map((e) => e.split("|"))
  .map((e) => {
    const inputs = e[0].match(/\b(\w+)\b/g);
    const outputs = e[1].match(/\b(\w+)\b/g);
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

const STROKES = {
  0: 6,
  1: 2,
  3: 5,
  4: 4,
  5: 5,
  6: 6,
  7: 3,
  8: 7,
  9: 6,
};

console.log("## PART 1 #####################");

const outputs = entries.map((e) => e[1]);
console.log(outputs);

const histo = {};
outputs.forEach((o) => {
  o.forEach((digit) => {
    const len = digit.length;
    if (histo[len]) {
      histo[len]++;
    } else {
      histo[len] = 1;
    }
  });
});

console.log(histo);

console.log("## PART 2 #####################");
const inputs = entries.map((e) => e[0]);
console.log(inputs[0]);
