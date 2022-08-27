import { useRouter } from 'next/router'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import styles from './HowItWorks.module.css'
import { useGetInterest } from '~/hooks/useInterest'

export default function HowItWorks() {
	const router = useRouter()
	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()
	const { openChainModal } = useChainModal()
	const { data } = useGetInterest()

	const currentAnnualInterest = typeof data === 'string' && !Number.isNaN(Number(data)) ? Number(data) : null

	return (
		<article className={styles.wrapper}>
			<h1 className={styles.header}>tubby sea</h1>

			<ul className={styles.list}>
				<li className={styles.listItem}>Deposit tubbies as collateral and borrow ETH</li>
				<li className={styles.listItem}>All loans last for 2 weeks max and there are no liquidations</li>
				<li className={styles.listItem}>Only pay for the time you borrow</li>
				<li className={styles.listItem}>
					<span>Interest rate is </span>
					{currentAnnualInterest ? (
						<span>{`${currentAnnualInterest}%`}</span>
					) : (
						<span className={`placeholder-container ${styles.interestLoading}`}></span>
					)}
					<span> per annum, and over 2 week loan term that equals </span>
					{currentAnnualInterest ? (
						<span>{`${(currentAnnualInterest / 14).toFixed(2)}%`}</span>
					) : (
						<span className={`placeholder-container ${styles.interestLoading}`}></span>
					)}
					<span> interest for the duration of the loan</span>
				</li>
			</ul>

			{isConnected ? (
				<p className={styles.connectWalletText}>
					<button onClick={openChainModal}>Switch Network</button>{' '}
					<span>
						{router.pathname === '/'
							? 'to view your tubby cats and start borrowing!'
							: router.pathname === '/repay'
							? 'to view your active loans'
							: 'to view your tubby cats and active loans'}
					</span>
				</p>
			) : (
				<p className={styles.connectWalletText}>
					<button onClick={openConnectModal}>Connect Wallet</button>{' '}
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
