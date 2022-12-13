import { useAppContext } from '../context/context';
import Image from 'next/image'
import style from '../styles/Loader.module.css';
import { useEffect } from 'react';

const Loader = () => {
  const { loaderStatus } = useAppContext();

  useEffect(() => {}, [loaderStatus]);

  return (
    <div 
      style={ loaderStatus ? { display: 'flex' } : { display: 'none' } }
      className={style.container}
    >
      <Image src="/loader.gif" alt="Loader" width={100} height={80} />
    </div>
  )
}
export default Loader;
