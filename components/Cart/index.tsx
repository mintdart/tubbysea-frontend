import * as React from 'react'
import { DisclosureState } from 'ariakit'
import { useAccount } from 'wagmi'
import { CartWithItems } from './CartWithItems'
import NoWalletCart from './NoWalletCart'

export default function Cart({ dialog }: { dialog: DisclosureState }) {
	const { isConnected } = useAccount()

	if (!isConnected) {
		return <NoWalletCart dialog={dialog} />
	}

	return <CartWithItems dialog={dialog} />
}
