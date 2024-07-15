const fs = require('fs');
const Web3 = require('web3');

const abi = JSON.parse(fs.readFileSync("Cruds.abi"));
const bytecode = fs.readFileSync("Cruds.bin").toString();

const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

async function deploy() {
    // const w3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(abi);
    contract = contract.deploy({data: bytecode});

    const deployContract = await contract.send({
        from: "0x44320f45A1784139f39cF40a3AE7D194Eea75b90",
        gas: "6721975",
    })
    console.log(deployContract.options.address);
}

deploy();
