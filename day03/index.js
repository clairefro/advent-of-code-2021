const fs = require("fs");

// Get input ------------------------------------------
const raw = fs.readFileSync("./input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  return data.toString();
});
// ----------------------------------------------------

const inputs = raw.split("\n");

console.log("## PART 1 #########################");

const bToDec = (binary) => {
  return parseInt(binary, 2);
};

// get most freq occurrance in array
const mode = (arr, trump) => {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    if (map[key]) {
      map[key]++;
    } else {
      map[key] = 1;
    }
  }
  const entries = Object.entries(map);
  if (map[0] === map[1]) {
    return trump;
  }
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const maxFreqKey = sorted[0][0];
  return maxFreqKey;
};

const reverseMode = (arr, trump = "1") => {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    if (map[key]) {
      map[key]++;
    } else {
      map[key] = 1;
    }
  }
  const entries = Object.entries(map);
  if (map[0] === map[1]) {
    return trump;
  }
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  const minFreqKey = sorted[0][0];
  return minFreqKey;
};

const getBits = (_inputs, index) => {
  return _inputs.map((i) => i[index]);
};

const getGamma = (_inputs) => {
  // assuming all inputs have same # of digits
  const numDigits = _inputs[0].split("").length;

  let gamma = "";
  for (let i = 0; i < numDigits; i++) {
    const bitsArr = getBits(inputs, i);
    const gammaDigit = mode(bitsArr);
    gamma += gammaDigit;
  }
  return gamma;
};

const gammaToEpsilon = (gamma) => {
  let epsilon = "";
  const bits = gamma.split("");
  bits.forEach((bit) => {
    if (bit === "0") {
      epsilon += "1";
    } else {
      epsilon += "0";
    }
  });
  return epsilon;
};

const gamma = getGamma(inputs);
const epsilon = gammaToEpsilon(gamma);

const gammaDec = bToDec(gamma);
const epsilonDec = bToDec(epsilon);

console.log("gamma", gammaDec);
console.log("epsilon", epsilonDec);
console.log("power", gammaDec * epsilonDec);

console.log("## PART 2 #########################");

const filterByMode = (_inputs, modeFn, trump = "1") => {
  let validInputs = [..._inputs];

  // assuming all inputs have same # of digits
  inputs[0].split("").forEach((_digit, i) => {
    const bitsArr = getBits(validInputs, i);
    const filter = modeFn(bitsArr, trump);
    validInputs = validInputs.filter((input) => {
      return input[i] === filter;
    });
  });

  const binary = validInputs[0];
  return bToDec(binary);
};

const oxygen = filterByMode(inputs, mode, "1");
console.log("Oxygen", oxygen);

const co2 = filterByMode(inputs, reverseMode, "0");
console.log("CO2", co2);

console.log("Product", co2 * oxygen);
