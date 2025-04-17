const fs = require('fs');

function readJson(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
}

function decodeValue(value, base) {
    return BigInt(parseInt(value, parseInt(base)));
}

function lagrangeInterpolation(points) {
    let secret = BigInt(0);

    for (let i = 0; i < points.length; i++) {
        let xi = BigInt(points[i][0]);
        let yi = BigInt(points[i][1]);

        let num = BigInt(1);
        let den = BigInt(1);

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = BigInt(points[j][0]);
                num *= -xj;
                den *= (xi - xj);
            }
        }

        let term = yi * num / den;
        secret += term;
    }

    return secret;
}

function computeSecret(filename) {
    const input = readJson(filename);
    const k = input.keys.k;

    const points = [];

    for (let key in input) {
        if (key === 'keys') continue;

        const x = parseInt(key);
        const base = input[key].base;
        const val = input[key].value;

        const y = decodeValue(val, base);
        points.push([x, y]);

        if (points.length === k) break;
    }

    const secret = lagrangeInterpolation(points);
    return secret.toString();
}

console.log("Secret from testcase 1:", computeSecret('testcase1.json'));
console.log("Secret from testcase 2:", computeSecret('testcase2.json'));
