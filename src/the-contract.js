const { theWeb3 } = require('./the-web3');
const { ETH_ENV } = require('../config/env');
const abi = require('../contract/abi.json');
const contractCfg = require('../contract/config.json');
const ethNetworkConfig = require('../config/eth-net-cfg.json')[ETH_ENV]; 

const contractAddr = contractCfg.market[ETH_ENV].address;
const fromBlock = contractCfg.market[ETH_ENV].blockNumber;
const theContract = new theWeb3.eth.Contract(abi, contractAddr);
theContract.defaultAccount = ethNetworkConfig.defaultAccount;

console.log('contract address ', contractAddr);
console.log('fromBlock ', fromBlock);

module.exports = { theContract, fromBlock };
