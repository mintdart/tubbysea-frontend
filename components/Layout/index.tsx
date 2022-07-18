import * as React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './Layout.module.css'

interface ILayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children, ...props }: ILayoutProps) {
	return (
		<>
			<header className={styles.header}>
				<ConnectButton />
			</header>
			<main className={styles.main} {...props}>
				{children}
			</main>
		</>
	)
}
