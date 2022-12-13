import coordinatorABI from './abis/RPSCoordinator.json';
const coordinatorAddress = '0x8f420B089dF9ee8Fae4da42aE2670C714b9Ae73D';

const coordinatorContract = (ethers, _signer) => {
    return new ethers.Contract(coordinatorAddress, coordinatorABI, _signer);
}

export default coordinatorContract;