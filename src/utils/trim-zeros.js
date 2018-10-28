const regex = /(0+)$|\.(0+)$/;

function trimZeros(value) {
    const v = String(value).replace(/^(0+)/, '');

    if (v.indexOf('.') === -1) {
        return v;
    }

    return String(value).replace(regex, '');
}

module.exports = { trimZeros };