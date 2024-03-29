import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useAccount, useNetwork } from 'wagmi'
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
	const { chain } = useNetwork()

	return (
		<>
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
					{isConnected && !chain?.unsupported ? children : <HowItWorks />}
				</main>
			</React.Suspense>
		</>
	)
}
