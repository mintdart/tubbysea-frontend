import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import styles from './Layout.module.css'
import Image from 'next/image'
import CartButton from '~/components/Cart/CartButton'

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

			<main className={styles.main} {...props}>
				<React.Suspense fallback={null}>
					{isConnected ? (
						children
					) : (
						<p className="fallback-text">
							<button onClick={openConnectModal}>Connect Wallet</button>
							<span> to view your nfts and loans</span>
						</p>
					)}
				</React.Suspense>
			</main>
		</>
	)
}
