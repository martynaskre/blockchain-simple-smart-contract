import Web3 from "web3";
import Lottery from '../../build/contracts/Lottery.json';
import contract from "@truffle/contract";

let web3;
let lotteryContract;

export const walletAvailable = () => window.ethereum !== undefined;

export const authorize = async () => {
  if (!walletAvailable()) {
    return false;
  }

  web3 = new Web3(window.ethereum);

  try {
    const wallets = await window.ethereum.request({ method: 'eth_requestAccounts' });

    lotteryContract = contract(Lottery);
    lotteryContract.setProvider(web3.currentProvider);

    return wallets;
  } catch (e) {
    //
  }

  return false;
};

export const getWeb3 = () => web3;

export const getLotteryContract = () => lotteryContract;
