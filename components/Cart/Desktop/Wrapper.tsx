import * as React from 'react'
import { useRouter } from 'next/router'
import useMedia from '~/hooks/useMedia'
import styles from './Desktop.module.css'

export default function Wrapper({ children }: { children: React.ReactNode }) {
	const router = useRouter()

	const { cart } = router.query

	const isDesktop = useMedia('(min-width: 80rem)', true)

	const isOpen = isDesktop && typeof cart === 'string' && cart === 'true'

	if (!isDesktop) {
		return null
	}

	return (
		<div className={styles.wrapper} style={{ display: isOpen ? 'flex' : 'none' }}>
			<h1 className={styles.title}>Checkout</h1>
			{children}
		</div>
	)
}
