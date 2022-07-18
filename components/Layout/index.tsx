import * as React from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './Layout.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface ILayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children, ...props }: ILayoutProps) {
	const router = useRouter()

	return (
		<>
			<Head>
				<title>lend your tubby cats!</title>
				<meta name="description" content="lend your tubby cats!" />
			</Head>
			<header className={styles.header}>
				<nav className={styles.nav}>
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
				{children}
			</main>
		</>
	)
}
