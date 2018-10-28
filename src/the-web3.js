const Web3 = require('Web3');
const { ETH_ENV } = require('../config/env');
const ethNetworkConfig = require('../config/eth-net-cfg.json')[ETH_ENV]; 

 // "the" means singleton
const ethNodeUrl = ethNetworkConfig.nodeUrl
const theWeb3 = new Web3(new Web3.providers.HttpProvider(ethNodeUrl));
const defaultAccount = theWeb3.defaultAccount = ethNetworkConfig.defaultAccount;
const fromBlockPromise = theWeb3.eth.getBlockNumber().then(n => n - 1000);

console.log('ETH_ENV ', ETH_ENV);
console.log('node url ', ethNodeUrl);

module.exports = { theWeb3, ethNetworkConfig, defaultAccount, fromBlockPromise };