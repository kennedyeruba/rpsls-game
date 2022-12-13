import { useAppContext } from '../context/context';
import styles from '../styles/Dashboard.module.css';
import StartGame from './StartGame';
import JoinGame from './JoinGame';
import Loader from './Loader';

const Dashboard = () => {
    const { 
        activeGame, 
        gamePath, 
        startGame, 
        joinGame 
    } = useAppContext();

    const renderView = () => {
        switch(gamePath) {
            case 'start':
                return <StartGame />
            case 'join':
                return <JoinGame />
        }
    }

    return (
        <div className={styles.container}>
            <Loader />
            {
                !activeGame && (
                    <div className={styles.buttonContainer}>
                        <button onClick={startGame}>Start Game</button>
                        <button onClick={joinGame}>Join Game</button>
                    </div>
                )
            }
            {
                activeGame && renderView()
            }
            
        </div>
    )
}
export default Dashboard;