import * as React from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { DisclosureState } from 'ariakit'
import Wrapper from './Wrapper'
import CartWithItems from '../CartWithItems'
import styles from '../Cart.module.css'

export function MobileOnlyCart({
	txDialog,
	transactionHash
}: {
	txDialog: DisclosureState
	transactionHash: React.MutableRefObject<string | null>
}) {
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
			<CartWithItems txDialog={txDialog} transactionHash={transactionHash} />
		</Wrapper>
	)
}
