import * as React from 'react'
import { DisclosureState } from 'ariakit'
import { useRouter } from 'next/router'
import { BorrowCartWithItems } from './Borrow'
import { RepayCartWithItems } from './Repay'

export default function CartWithItems({
	txDialog,
	transactionHash
}: {
	txDialog: DisclosureState
	transactionHash: React.MutableRefObject<string | null>
}) {
	const router = useRouter()

	if (router.pathname === '/repay') {
		return <RepayCartWithItems />
	}

	return <BorrowCartWithItems txDialog={txDialog} transactionHash={transactionHash} />
}
