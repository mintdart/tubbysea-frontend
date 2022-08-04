import * as React from 'react'
import { useDialogState } from 'ariakit'
import { useAccount } from 'wagmi'
import { CartWithItems } from './CartWithItems'
import NoWalletCart from './NoWalletCart'
import { useRouter } from 'next/router'
import useMedia from '~/hooks/useMedia'

export default function Cart() {
	const isLarge = useMedia('(min-width: 37.5rem)', true)

	const router = useRouter()

	const { cart } = router.query

	const dialog = useDialogState({
		open: !isLarge && typeof cart === 'string' && cart === 'true',
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
