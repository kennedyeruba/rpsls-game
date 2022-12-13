import { useState } from 'react';
import { useAppContext } from '../context/context';
import styles from '../styles/SelectMove.module.css';

const SelectMove = ({ player }) => {
  const { makeMove } = useAppContext();
  const [move, setMove] = useState('');

  const onMoveClick = (e) => {
    if(e.target.textContent) {
        const { textContent } = e.target;
        const selectedMove = textContent.toLowerCase();
        setMove(selectedMove);
    }
  }

  return (
    <div className={styles.container}>
       <p>Select Move</p>
       <div className={styles.moveContainer}>
            <div 
                style={move == 'rock' ? { background: 'rgba(164, 61, 255, 0.593)', color: 'white' } : {}}
                className={styles.move}
                onClick={onMoveClick}
            >
                <p>Rock</p>
            </div>
            <div 
                style={move == 'paper' ? { background: 'rgba(164, 61, 255, 0.593)', color: 'white' } : {}}
                className={styles.move}
                onClick={onMoveClick}
            >
                <p>Paper</p>
            </div>
            <div 
                style={move == 'scissors' ? { background: 'rgba(164, 61, 255, 0.593)', color: 'white' } : {}}
                className={styles.move}
                onClick={onMoveClick}
            >
                <p>Scissors</p>
            </div>
            <div 
                style={move == 'lizard' ? { background: 'rgba(164, 61, 255, 0.593)', color: 'white' } : {}}
                className={styles.move}
                onClick={onMoveClick}
            >
                <p>Lizard</p>
            </div>
            <div 
                style={move == 'spock' ? { background: 'rgba(164, 61, 255, 0.593)', color: 'white' } : {}}
                className={styles.move}
                onClick={onMoveClick}
            >
                <p>Spock</p>
            </div>
       </div>
       <button onClick={() => makeMove(player, move)}>Make Move</button>
    </div>
  )
}
export default SelectMove;
