import * as React from 'react'
import { useAccount, useNetwork } from 'wagmi'
import Wrapper from './Wrapper'
import { CartWithItems } from '../CartWithItems'
import styles from '../Cart.module.css'

export function MobileOnlyCart() {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	if (!isConnected) {
		return (
			<Wrapper>
				<p className={styles.emptyMsg}>Connect wallet to view items in cart.</p>
			</Wrapper>
		)
	}

	if (chain?.unsupported) {
		return (
			<Wrapper>
				<p className={styles.emptyMsg}>Connect wallet to the app's supported network to view items in cart.</p>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<CartWithItems />
		</Wrapper>
	)
}
