const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

// count the number of times a depth measurement increases
// from the previous measurement

/** ex
199 (N/A - no previous measurement)
200 (increased)
208 (increased)
210 (increased)
200 (decreased)
207 (increased)
240 (increased)
269 (increased)
260 (decreased)
263 (increased)
 */

let input = raw.split("\n").map((i) => parseInt(i));

let count = 0;
input.forEach((v, i) => {
  const cur = input[i];
  const next = input[i + 1];
  if (next > cur) {
    count++;
  }
});

console.log("## PART 1 ###########################");
console.log("Increases: ", count);

console.log("## PART 2 ###########################");
