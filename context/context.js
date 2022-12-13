import { createContext, useState, useContext } from 'react';
import { ethers } from 'ethers';
import createNewHasherContractInstance from '../utils/hasherContract';
import createNewCoordinatorContractInstance from '../utils/RPSCoordinatorContract';
import createNewRPSContractFactory from '../utils/RPSContractFactory';
import createNewRPSContractInstance from '../utils/RPSContract';
import generateGameID from '../utils/generateGameID';
import parseMove from '../utils/moveParser';
import parseOutcome from '../utils/outcomeParser';

export const appContext = createContext();

export const AppProvider = ({ children }) => {
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [starterMove, setStarterMove] = useState(null);
  const [opponentAddress, setOpponentAddress] = useState(null);
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [hasherContract, setHasherContract] = useState(null);
  const [coordinatorContract, setCoordinatorContract] = useState(null);
  const [RPSContract, setRPSContract] = useState(null);
  const [RPSContractAddress, setRPSContractAddress] = useState(null);
  const [activeGame, setActiveGame] = useState(false);
  const [gameID, setGameID] = useState(null);
  const [gamePath, setGamePath] = useState(null);
  const [gamePhase, setGamePhase] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [timeOutWinner, setTimeOutWinner] = useState(null);
  const SALT = parseInt(process.env.NEXT_PUBLIC_SALT);

  const connectWallet = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {
        setLoaderStatus(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setAddress(address);
        setSigner(signer);

        const newCoordinatorContract = createNewCoordinatorContractInstance(ethers, signer);
        const newHasherContract = createNewHasherContractInstance(ethers, signer);

        setHasherContract(newHasherContract);
        setCoordinatorContract(newCoordinatorContract);
        setLoaderStatus(false);

        window.ethereum.on('accountsChanged', async () => {
          const address = await signer.getAddress();
          setAddress(address);
        });
      } catch(err) {
        console.log('[Error Connecting]: ', err);
      }
    } else {
      console.log('Please install MetaMask');
    }
  }

  const startGame = async () => {
    try {
      setLoaderStatus(true);
      const newGameID = generateGameID();

      setGameID(newGameID);
    
      await coordinatorContract.connect(signer).startGame(newGameID);
      
      setActiveGame(true);
      setGamePath('start');
      setGamePhase('share');

      // Listen for when game starts
      coordinatorContract.on('Started', (_gameID, _starter) => {
        console.log(`Started => Player 1: ${_starter}, Game ID: ${_gameID}`);
        setLoaderStatus(false);
      });

      // Listen for when player 2 joins
      coordinatorContract.on('Joined', (_gameID, _starter, _joiner) => {
        console.log(`Opponent Joined =>  Player 1: ${_starter}, Player 2: ${_joiner}, Game ID: ${_gameID}`);
        setOpponentAddress(`${_joiner}`);
        setGamePhase('move');
      });

    } catch(err) {
      console.log('[Error Starting Game]: ', err);
    }
  }

  const joinGame = () => {
    setActiveGame(true);
    setGamePath('join');
    setGamePhase('coordinator-join');
  }

  const verifyGameID = async (_id) => {
    try {
      setLoaderStatus(true);
      await coordinatorContract.connect(signer).joinGame(_id);

      // Listen for player join
      coordinatorContract.on('Joined', (_gameID, _starter, _joiner) => {
        console.log(`Joined => Player 1: ${_starter}, Player 2: ${_joiner}, Game ID: ${_gameID}`);
        setOpponentAddress(`${_starter}`);
        setGamePhase('move-waiting');
        setLoaderStatus(false);
      });
      
      // Listen for player 1 move
      coordinatorContract.on('Moved', (_player) => {
        console.log(`Moved => Player 1: ${_player}`);
        setGamePhase('rps-join');
      });
    } catch(err) {
      console.log('[Error Verifying Game ID]: ', err);
    }
  }

  const verifyRPSContractAddress = async (_address) => {
    try {
      setLoaderStatus(true);
      // Create RPS instance to verify contract address
      const newRPSContract = createNewRPSContractInstance(ethers, signer, _address);
      setRPSContract(newRPSContract);
      setGamePhase('move');
      setLoaderStatus(false);
    } catch(err) {
      console.log('[Error Verifying RPS address]: ', err);
    }
  }

  const makeMove = async (_player, _move) => {
    try {
      if(_player === 'starter') {
        setLoaderStatus(true);
        const moveHash = await hasherContract.hash(parseMove(_move), SALT);
        const deployedRPSContract = await createNewRPSContractFactory(ethers, signer, moveHash, opponentAddress);

        setStarterMove(_move);
        setRPSContract(deployedRPSContract);
        setRPSContractAddress(deployedRPSContract.address);
        setGamePhase('move-waiting');

        await coordinatorContract.connect(signer).makeMove();
        setLoaderStatus(false);

        // Listen for player 2 move
        deployedRPSContract.on('Moved', (_address) => {
          console.log('Player 2 move event before timeout check');
          if(timeOutWinner != null) return;
          console.log(`Moved => Player 2: ${_address}`);
          if(_address === opponentAddress) setGamePhase('reveal');
        });

        // Listen for player 2 timeout
        deployedRPSContract.on('TimedOut', (_winner) => {
          console.log(`TimedOut => Winner: ${_winner}`);
          if(_winner === opponentAddress) {
            setTimeOutWinner('Player 2');
          } else {
            setTimeOutWinner('Player 1');
          }
          setGamePhase('timeout');
          setLoaderStatus(false);
        });

      } else if(_player === 'joiner') {
        setGamePhase('reveal-waiting');
        // Check player 2 timeout
        // const estimatedGas = await RPSContract.estimateGas.j2Timeout();
        // await RPSContract.j2Timeout({
        //   gasLimit: estimatedGas
        // });

        if(timeOutWinner == null) 
          await RPSContract.play(parseMove(_move), { 
            value: ethers.utils.parseEther('0.005'),
          });
        
        // Listen for player 1 reveal
        RPSContract.on('Revealed', (_outcome) => {
          if(timeOutWinner != null) return;
          const gameOutcome = parseOutcome(_outcome);
          console.log(`Revealed => ${gameOutcome}`);
          setOutcome(gameOutcome);
          setGamePhase('final');
        });

        // Listen for player 1 timeout
        RPSContract.on('TimedOut', (_winner) => {
          console.log(`TimedOut => Winner: ${_winner}`);
          if(_winner === opponentAddress) {
            setTimeOutWinner('Player 1');
          } else {
            setTimeOutWinner('Player 2');
          }
          setGamePhase('timeout');
          setLoaderStatus(false);
        });
      }
    } catch(err) {
      console.log('[Error Making Move]: ', err);
    }
  }

  const revealMove = async () => {
    try {
      setLoaderStatus(true);
      // Check player 1 timeout
      // const estimatedGas = await RPSContract.estimateGas.j1Timeout();
      //   await RPSContract.j1Timeout({
      //     gasLimit: estimatedGas
      //   });
      // await RPSContract.j1Timeout();
      if(timeOutWinner == null) await RPSContract.solve(parseMove(starterMove), SALT);

      // Listen for reveal
      RPSContract.on('Revealed', (_outcome) => {
        if(timeOutWinner != null) return;
        const gameOutcome = parseOutcome(_outcome);
        console.log(`Revealed => ${gameOutcome}`);
        setOutcome(gameOutcome);
        setGamePhase('final');
        setLoaderStatus(false);
      });
    } catch(err) {
      console.log('[Error Revealing Move]: ', err);
    }
  }

  return (
    <appContext.Provider
      value={{
        address,
        opponentAddress,
        connectWallet,
        startGame,
        joinGame,
        activeGame,
        gameID,
        gamePath,
        verifyGameID,
        makeMove,
        gamePhase,
        revealMove,
        RPSContractAddress,
        verifyRPSContractAddress,
        outcome,
        loaderStatus,
        timeOutWinner
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(appContext)
}
