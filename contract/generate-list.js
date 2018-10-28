const fs = require('fs');

const abiJson  = require('./abi.json');

const nameList = abiJson.map((x, i) => {
    const inp = x.inputs ? '(' + x.inputs.map(i => (i.name ? i.name : '_') + ': ' + i.type).join(', ') + ')' : '()';
    const out = x.outputs ? '[' + x.outputs.map(i => (i.name ? i.name : '_') + ': ' + i.type).join(', ') + ']' : '[]'

    return `${x.name} ${inp} => ${out} // ${x.type}`;

}).sort().join('\n\n');


fs.writeFileSync(__dirname + '/abi.txt', nameList);

console.log(nameList);
