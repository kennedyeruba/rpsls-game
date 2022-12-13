import hasherABI from './abis/Hasher.json'
const hasherAddress = '0x94DD2ed80A70073b16bfdC6235f6152d8EDF7324';

const hasherContract = (ethers, _signer) => {
  return new ethers.Contract(hasherAddress, hasherABI, _signer);
}

export default hasherContract;