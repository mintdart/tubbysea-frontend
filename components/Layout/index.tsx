import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './Layout.module.css'
import Image from 'next/image'

interface ILayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children, ...props }: ILayoutProps) {
	const router = useRouter()

	const { isConnected } = useAccount()

	return (
		<>
			<Head>
				<title>pawn your tubby cats!</title>
				<meta name="description" content="pawn your tubby cats!" />
			</Head>
			<header className={styles.header}>
				<nav className={styles.nav}>
					<div className={styles.logoWrapper}>
						<Image src="/tubby.png" alt="tubby cat" layout="fill" />
					</div>
					<Link href="/">
						<a data-active={router.pathname === '/'}>Borrow</a>
					</Link>
					<Link href="/repay">
						<a data-active={router.pathname === '/repay'}>Repay</a>
					</Link>
				</nav>
				<ConnectButton />
			</header>
			<main className={styles.main} {...props}>
				{isConnected && children}
			</main>
		</>
	)
}
