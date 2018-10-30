const { trimZeros } = require('./trim-zeros');

const zeroString200 = new Array(200).join('0');

function moveDecimalPoint(
    num,
    offs,
    precision = +Infinity,
    dotSymbol = '.',
) {
    let result = String(num);

    if (typeof offs === 'number' && offs !== 0) {
        const [a, b = ''] = result.split(dotSymbol);
        const dotIndex = a.length;
        const len = a.length + b.length;
        const newDotIdx = dotIndex + offs;

        if (newDotIdx < 0) {
            result =
                '0' + dotSymbol + zeroString200.slice(0, -newDotIdx) + a + b;
        } else {
            if (newDotIdx === 0) {
                result = '0.' + a + b;
            } else if (newDotIdx > len) {
                result = a + b + zeroString200.slice(0, newDotIdx - len);
            } else {
                const alen = a.length;

                if (newDotIdx > alen) {
                    const bDotIdx = newDotIdx - alen;
                    result =
                        a + b.slice(0, bDotIdx) + dotSymbol + b.slice(bDotIdx);
                } else {
                    result =
                        a.slice(0, newDotIdx) +
                        dotSymbol +
                        a.slice(newDotIdx) +
                        b;
                }
            }
        }
    }

    if (precision !== +Infinity) {
        result = cutOffFractionalPart(result, precision)
    }

    result = trimZeros(result);

    return result;
}

function cutOffFractionalPart(decimal, length) {
    const s = String(decimal);
    const pointIdx = s.indexOf('.');
    let cutOffTo = pointIdx + length + 1;
    const fractionalPart = s.slice(pointIdx + 1);
    const notZeroIdx = fractionalPart.split('').findIndex(c => c !=='0') + pointIdx + 2;
    if (notZeroIdx > cutOffTo) {
        cutOffTo = notZeroIdx;
    }
    return s.slice(0, cutOffTo);
}

module.exports = { moveDecimalPoint, cutOffFractionalPart };