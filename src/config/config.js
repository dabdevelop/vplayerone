/* jshint esversion: 6 */ 
var ENV = 'enu';
var network;
var options;
var networkName;

var mainToken; // 主网代币，永远是EOS, 不会变
var gameToken; // 游戏代币，游戏盘是 CGT， EOS盘是EOS
var tokenContract;
var gameTokenContract;
var gameContract;

function setNetwork(){
    if(ENV === 'dev'){
        // local dev testnet
        mainToken = "EOS"; // 主网代币，EOS主网是EOS
        gameToken = "CGT"; // 游戏代币，游戏是 CGT
        tokenContract = "eosio.token";
        gameTokenContract = "playeroneiss";
        gameContract = "oneplayerone";

        network = {
            blockchain: 'eos',
            host: '127.0.0.1',
            port: 8888,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
            protocol: "http"
        };
        options = {
            broadcast: true,
            sign: true,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
            httpEndpoint: "http://127.0.0.1:8888"
        };
        networkName = 'EOS测试网';
    } else if(ENV === 'testnet'){
        // remote testnet
        mainToken = "EOS"; // 主网代币，EOS主网是EOS
        gameToken = "CGT"; // 游戏代币，游戏是 CGT
        tokenContract = "eosio.token";
        gameTokenContract = "playeroneiss";
        gameContract = "oneplayerone";
        network = {
            blockchain: 'eos',
            host: '192.168.8.101',
            port: 8888,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
            protocol: "http"
        };
        options = {
            broadcast: true,
            sign: true,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
            httpEndpoint: "http://192.168.8.101:8888"
        };
        networkName = 'EOS测试网';
    } else if( ENV === 'eos'){
        // mainnet
        mainToken = "EOS"; // 主网代币，EOS主网是EOS
        gameToken = "CGT"; // 游戏代币，游戏是 CGT
        tokenContract = "eosio.token";
        gameTokenContract = "playeroneiss";
        gameContract = "oneplayerone";
        network = {
            blockchain: 'eos',
            host: 'api.eosnewyork.io',
            port: 443,
            chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
            protocol: "https"
        };

        options = {
            broadcast: true,
            sign: true,
            chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
            httpEndpoint: "https://api.eosnewyork.io:443"
        };
        networkName = 'EOS主网';
    } else if( ENV === 'enu'){
        // mainnet
        mainToken = "ENU"; // 主网代币，ENU主网是ENU
        gameToken = "CGT"; // 游戏代币，游戏是 CGT
        tokenContract = "enu.token";
        gameTokenContract = "playeroneiss";
        gameContract = "oneplayerone";
        network = {
            blockchain: 'enu',
            host: 'rpc.enu.one',
            port: 443,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
            protocol: "https"
        };

        options = {
            broadcast: true,
            sign: true,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
            httpEndpoint: "https://rpc.enu.one:443"
        };
        networkName = 'ENU主网';
    } else {
        throw("network confi error");
    }
}

function setENV(env){
    ENV = env;
    setNetwork();
    return {
        appName: "eos dapp",
        mainToken: mainToken, 
        gameToken: gameToken, 
        tokenContract: tokenContract,
        gameTokenContract: gameTokenContract,
        gameContract: gameContract,
        
        version: "1.0",
        env: ENV,
        network: network,
        options: options,
        networkName: networkName,
        setENV: setENV
    };
}

setNetwork();

export default {
    appName: "eos dapp",
    mainToken: mainToken, 
    gameToken: gameToken, 
    tokenContract: tokenContract,
    gameTokenContract: gameTokenContract,
    gameContract: gameContract,
    
    version: "1.0",
    env: ENV,
    network: network,
    options: options,
    networkName: networkName,
    setENV: setENV
};