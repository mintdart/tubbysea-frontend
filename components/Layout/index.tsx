import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import CartButton from '~/components/Cart/CartButton'
import styles from './Layout.module.css'
import HowItWorks from '../HowItWorks'

interface ILayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children, ...props }: ILayoutProps) {
	const router = useRouter()

	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()

	return (
		<>
			<Head>
				<meta name="description" content="pawn your tubby cats!" />
			</Head>
			<header className={styles.header}>
				<nav className={styles.nav}>
					<div className={styles.logoWrapper}>
						<Image src="/tubby.png" alt="tubby cat" height="24px" width="22" objectFit="contain" priority />
					</div>
					<Link href="/">
						<a data-active={router.pathname === '/'}>Borrow</a>
					</Link>
					<Link href="/repay">
						<a data-active={router.pathname === '/repay'}>Repay</a>
					</Link>
				</nav>

				<span className={styles.walletsWrapper}>
					<ConnectButton />
					<CartButton />
				</span>
			</header>

			<React.Suspense fallback={null}>
				<main className={styles.main} {...props}>
					{isConnected ? (
						children
					) : router.pathname === '/' ? (
						<HowItWorks />
					) : router.pathname === '/repay' ? (
						<p className="fallback-text">
							<button onClick={openConnectModal}>Connect Wallet</button>
							<span> to view your active loans</span>
						</p>
					) : (
						<p className="fallback-text">
							<button onClick={openConnectModal}>Connect Wallet</button>
							<span> to view your nfts and loans</span>
						</p>
					)}
				</main>
			</React.Suspense>
		</>
	)
}
