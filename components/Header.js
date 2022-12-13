import { useAppContext } from '../context/context';
import shortenAddress from '../utils/shortenAddress';
import style from '../styles/Header.module.css';

const Header = () => {
  const { address, connectWallet } = useAppContext();

  return (
    <div className={style.container}>
        <h1>RPSLS Game</h1>
      <button onClick={connectWallet}>
        {
          address == null ? (
            `Connect`
          ) : (
            shortenAddress(address)
          )
        }
    </button>
    </div>
  )
}
export default Header;
