import * as React from 'react'
import { useAccount } from 'wagmi'
import Wrapper from './Wrapper'
import { CartWithItems } from '../CartWithItems'
import styles from '../Cart.module.css'

export function MobileOnlyCart() {
	const { isConnected } = useAccount()

	if (!isConnected) {
		return (
			<Wrapper>
				<p className={styles.emptyMsg}>Connect wallet to view items in cart.</p>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<CartWithItems />
		</Wrapper>
	)
}
