import { useState, useEffect } from 'react';
import { useAppContext } from '../context/context';
import SelectMove from './SelectMove';
import styles from '../styles/JoinGame.module.css';

const JoinGame = () => {
    const [userGameID, setGameId] = useState(null);
    const [RPSContractAddress, setRPSContractAddress] = useState(null);
    const { 
        verifyGameID, 
        outcome, 
        verifyRPSContractAddress, 
        gamePhase, 
        activeGame,
        timeOutWinner
    } = useAppContext();

    const handleGameIdChange = (e) => {
        e.preventDefault();
        setGameId(e.target.value);
    }

    const handleRPSContractAddressChange = (e) => {
        e.preventDefault();
        setRPSContractAddress(e.target.value);
    }

    const submitGameID = () => userGameID != null && verifyGameID(userGameID);

    const submitRPSContractAddress = () => RPSContractAddress != null && verifyRPSContractAddress(RPSContractAddress);

    const renderView = () => {
        switch(gamePhase) {
            case 'coordinator-join':
                return (
                    <div className={styles.textInput}>
                        <p>Enter Game ID</p>
                        <input type="text" onChange={handleGameIdChange} required/>
                        <button onClick={submitGameID}>Join Game</button>
                    </div>
                );
            case 'move-waiting':
                return (
                    <p>Waiting for player 1 to move...</p>
                );
            case 'rps-join':
                return (
                    <div className={styles.textInput}>
                        <p>Enter RPS Address</p>
                        <input type="text" onChange={handleRPSContractAddressChange} required/>
                        <button onClick={submitRPSContractAddress}>Validate Address</button>
                    </div>
                );
            case 'move':
                return (
                    <SelectMove player={'joiner'}/>
                );
            case 'reveal-waiting':
                return (
                    <p>Waiting for player 1 to reveal move...</p>
                );
            case 'final':
                return (
                    <>
                        <p>Outcome:</p>
                        <p><span>{outcome}</span></p>
                    </>
                );
            case 'timeout':
                return (
                    <>
                        <p>Timed Out!</p>
                        <p>Winner: <span>{timeOutWinner}</span></p>
                    </>
                );
        }
    }

    useEffect(() => {}, [gamePhase]);

    return (
        <div className={styles.container}>
            {
                activeGame && renderView()
            }
        </div>
    )
}
export default JoinGame;
