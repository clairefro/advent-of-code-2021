const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

console.log("## PART 1 ###########################");

// count the number of times a depth measurement increases
// from the previous measurement

/** ex
199 (N/A - no previous measurement)
200 (increased)
208 (increased)
210 (increased)
200 (decreased)
 */

let input = raw.split("\n").map((i) => parseInt(i));

const countIncs = (arr) => {
  let count = 0;
  arr.forEach((v, i) => {
    const cur = arr[i];
    const next = arr[i + 1];
    if (next > cur) {
      count++;
    }
  });
  return count;
};

console.log("Increases: ", countIncs(input));

console.log("## PART 2 ###########################");

// PART 1

// count thenumber of times the sum of measurements in a
// three-measurement sliding window increases

const slidingSums = [];

input.forEach((v, i) => {
  const vals = [v, input[i + 1], input[i + 2]];
  if (vals[2] == undefined) {
    return;
  }
  slidingSums.push(vals.reduce((a, b) => a + b));
});

console.log("Increases: ", countIncs(slidingSums));
