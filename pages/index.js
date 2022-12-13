import Head from 'next/head'
import Image from 'next/image'
import { useAppContext } from '../context/context';
import Dashboard from '../components/Dashboard'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { address } = useAppContext();

  return (
    <div className={styles.container}>
      <Header/>
      {
        address != null ? (
          <Dashboard/>
        ) : (
          <div className={styles.noConnect}>
            <p>Please connect to play</p>
          </div>
        )
      }
    </div>
  )
}
