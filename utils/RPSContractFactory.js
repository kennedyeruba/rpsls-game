import RPS_ByteCode from './bytecode/RPSByteCode.json';
import RPS_ABI from './abis/RPS.json';

const RPSContractFactory = async (ethers, _signer, _hash, _address) => {
    const RPSContract = new ethers.ContractFactory(RPS_ABI, `0x${RPS_ByteCode.object}`, _signer);
    const rpsContract = await RPSContract.deploy(_hash, _address, { value: ethers.utils.parseEther('0.005') });
    await rpsContract.deployed();
    return rpsContract;
}

export default RPSContractFactory;
