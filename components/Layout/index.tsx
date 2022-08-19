import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import CartButton from '~/components/Cart/CartButton'
import styles from './Layout.module.css'
import HowItWorks from '../HowItWorks'

interface ILayoutProps {
	children?: React.ReactNode
	style?: React.CSSProperties
	className?: string
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
	const router = useRouter()

	const { isConnected } = useAccount()

	return (
		<>
			<Head>
				<meta
					name="description"
					content="tubby sea is a lending protocol that allows you to deposit tubby cats in order to borrow ETH."
				/>

				<meta property="og:title" content="tubby sea" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="tubby sea" />
				<meta
					property="og:description"
					content="tubby sea is a lending protocol that allows you to deposit tubby cats in order to borrow ETH."
				/>
				<meta property="og:image" content="https://borrow.tubbysea.com/og.png" />
				<meta property="og:url" content="https://borrow.tubbysea.com" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="borrow.tubbysea.com" />
				<meta name="twitter:title" content="tubby sea" />
				<meta
					name="twitter:description"
					content="tubby sea is a lending protocol that allows you to deposit tubby cats in order to borrow ETH."
				/>
				<meta name="twitter:image" content="https://borrow.tubbysea.com/og.png" />
				<meta property="twitter:url" content="https://borrow.tubbysea.com" />
			</Head>

			<header className={styles.header}>
				<nav className={styles.nav}>
					<div className={styles.logoWrapper}>
						<Image src="/paw.png" alt="tubbysea" height="36px" width="36px" priority />
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
				<main className={`${styles.main} ${className}`} {...props}>
					{isConnected ? children : <HowItWorks />}
				</main>
			</React.Suspense>
		</>
	)
}
