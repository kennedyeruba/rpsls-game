import { useEffect } from 'react';
import { useAppContext } from '../context/context';
import style from '../styles/StartGame.module.css';
import SelectMove from './SelectMove';

const StartGame = () => {
  const { 
    gameID, 
    outcome, 
    RPSContractAddress, 
    gamePhase, 
    activeGame, 
    revealMove,
    timeOutWinner
  } = useAppContext();

  const renderView = () => {
    switch(gamePhase) {
      case 'share':
        return (
          <>
            <p>Share game ID with player 2:</p>
            <p><span>{gameID}</span></p>
          </>
        );
      case 'move':
        return (
          <SelectMove player={'starter'}/>
        );
      case 'move-waiting':
        return (
          <>
            <p>Share contract address with player 2</p>
            <p><span>{RPSContractAddress}</span></p>
          </>

        );
      case 'reveal':
        return (
          <button onClick={revealMove}>Reveal Move</button>
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
    <div className={style.container}>
      {
        activeGame && renderView()
      }
    </div>
  )
}
export default StartGame;
