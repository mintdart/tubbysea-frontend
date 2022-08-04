import * as React from 'react'
import { useRouter } from 'next/router'
import { useDialogState } from 'ariakit'
import { useAccount } from 'wagmi'
import Wrapper from './Wrapper'
import { CartWithItems } from '../CartWithItems'
import useMedia from '~/hooks/useMedia'
import styles from '../Cart.module.css'

export default function MobileOnlyCart() {
	const isDesktop = useMedia('(min-width: 80rem)', true)

	const router = useRouter()

	const { cart } = router.query

	const dialog = useDialogState({
		open: !isDesktop && typeof cart === 'string' && cart === 'true',
		setOpen: (open) => {
			if (!open) {
				router.push('/')
			}
		}
	})

	const { isConnected } = useAccount()

	if (!isConnected) {
		return (
			<Wrapper dialog={dialog}>
				<p className={styles.emptyMsg}>Connect wallet to view items in cart.</p>
			</Wrapper>
		)
	}

	return (
		<Wrapper dialog={dialog}>
			<CartWithItems />
		</Wrapper>
	)
}
