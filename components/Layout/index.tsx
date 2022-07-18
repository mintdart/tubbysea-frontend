import * as React from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './Layout.module.css'

interface ILayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children, ...props }: ILayoutProps) {
	return (
		<>
			<Head>
				<title>lend your tubby cats!</title>
				<meta name="description" content="lend your tubby cats!" />
			</Head>
			<header className={styles.header}>
				<ConnectButton />
			</header>
			<main className={styles.main} {...props}>
				{children}
			</main>
		</>
	)
}
