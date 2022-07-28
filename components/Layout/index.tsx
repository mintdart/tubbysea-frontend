import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import styles from './Layout.module.css'
import Image from 'next/image'
import { useGetCartItems } from '~/hooks/useCart'
import { useGetNfts } from '~/hooks/useGetNfts'
import { useGetLoans } from '~/hooks/useGetLoans'

interface ILayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children, ...props }: ILayoutProps) {
	const router = useRouter()
	const { cart } = router.query
	const isCartToggled = cart && typeof cart === 'string' && cart === 'true'

	const { isConnected } = useAccount()
	const { openConnectModal } = useConnectModal()

	const { data: cartItems } = useGetCartItems()

	// prefetch queries
	useGetNfts()
	useGetLoans()

	return (
		<>
			<Head>
				<title>pawn your tubby cats!</title>
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

					<button
						onClick={() =>
							router.push({
								pathname: '/',
								query: {
									cart: isCartToggled ? false : true
								}
							})
						}
						className={styles.cartButton}
					>
						<span className="visually-hidden">{isCartToggled ? 'Close Cart' : 'Open Cart'}</span>

						<span className={styles.noOfItems}>{cartItems?.length ?? 0}</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</button>
				</span>
			</header>

			<main className={styles.main} {...props}>
				{isConnected ? (
					children
				) : (
					<p className="fallback-text">
						<button onClick={openConnectModal}>Connect Wallet</button>
						<span> to view your nfts and loans</span>
					</p>
				)}
			</main>
		</>
	)
}
