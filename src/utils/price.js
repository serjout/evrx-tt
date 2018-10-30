const { moveDecimalPoint } = require('./move-decimal-point');
const { PRECISION, PRECISION_MUL } = require('../const');

function getRawPrice(amountBuy, amountPay) {
    return BigInt(amountBuy) * PRECISION_MUL / BigInt(amountPay);
}

function getDecimalPrice(amountBuy, amountPay) {
    const raw = BigInt(amountBuy) * PRECISION_MUL / BigInt(amountPay);
    return moveDecimalPoint(String(raw), -PRECISION);
}

module.exports = { getRawPrice, getDecimalPrice }