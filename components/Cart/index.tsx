import * as React from 'react'
import { useDialogState } from 'ariakit'
import { useAccount } from 'wagmi'
import { CartWithItems } from './CartWithItems'
import NoWalletCart from './NoWalletCart'
import { useRouter } from 'next/router'

export default function Cart() {
	const router = useRouter()
	const { mobileCart } = router.query

	const dialog = useDialogState({
		open: typeof mobileCart === 'string' && mobileCart === 'true',
		setOpen: (open) => {
			if (!open) {
				router.push('/')
			}
		}
	})

	const { isConnected } = useAccount()

	if (!isConnected) {
		return <NoWalletCart dialog={dialog} />
	}

	return <CartWithItems dialog={dialog} />
}
