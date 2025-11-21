const fs = require("fs");

const filenm= process.argv[2] || "input.json";


const raw = fs.readFileSync(filenm);
const data = JSON.parse(raw);

let xs = [];
let ys = [];

for (const key in data) {
    if (key === "keys") continue;

    const x = BigInt(parseInt(key));
    const base = parseInt(data[key].base);
    const value = data[key].value;

    const y = bigIntBase(value, base);

    xs.push(x);
    ys.push(y);
}


function gcd(a, b) {
    while (b !== 0n) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function findConst(xs, ys) {
    let numC = 0n;
    let denC = 1n;

    const n = xs.length;

    for (let i = 0; i < n; i++) {
        let xi = xs[i];
        let yi = ys[i];

        let num = 1n;
        let den = 1n;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                num *= -xs[j];
                den *= (xi - xs[j]);
            }
        }

        let termNum = yi * num;
        let termDen = den;

        numC = numC * termDen + termNum * denC;
        denC = denC * termDen;

        const g = gcd(numC < 0n ? -numC : numC, denC);
        numC /= g;
        denC /= g;
    }

    return numC / denC;
}




function bigIntBase(str, base) {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    str = str.toLowerCase();

    let result = 0n;
    for (let ch of str) {
        const v = BigInt(digits.indexOf(ch));
        result = result * BigInt(base) + v;
    }
    return result;
}

const C = findConst(xs, ys);
console.log("Constant term C =", C.toString());
