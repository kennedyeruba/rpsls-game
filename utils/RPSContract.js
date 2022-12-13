import RPS_ABI from './abis/RPS.json';

const RPSContract = (ethers, _signer, _address) => {
  return new ethers.Contract(_address, RPS_ABI, _signer);
}

export default RPSContract;