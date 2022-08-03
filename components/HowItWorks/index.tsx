import { useRouter } from 'next/router'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
	const router = useRouter()
	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()

	return (
		<article className={styles.wrapper}>
			<h1 className={styles.header}>TUBBY SEA</h1>
			<ul className={styles.list}>
				<li className={styles.listItem}>Deposit tubbies as collateral and borrow ETH</li>
				<li className={styles.listItem}>All loans last for 2 weeks max and there are no liquidations</li>
				<li className={styles.listItem}>Only pay for the time you borrow</li>
				<li className={styles.listItem}>Interest is based on pool utilization and capped at 80%</li>
			</ul>
			{!isConnected && (
				<p className={styles.connectWalletText}>
					<button onClick={openConnectModal}>Connect Wallet</button>
					<span>
						{router.pathname === '/'
							? 'to view your tubby cats and start borrowing!'
							: router.pathname === '/repay'
							? 'to view your active loans'
							: 'to view your tubby cats and active loans'}
					</span>
				</p>
			)}
		</article>
	)
}
