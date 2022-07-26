import BigNumber from 'bignumber.js'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS } from '~/lib/contracts'
import { useGetCartItems } from './useCart'
import { useGetQuote } from './useGetQuote'

export function useBorrow() {
	const { data: cartItems, isLoading: fetchingCartItems, isError: failedToFetchCartItems } = useGetCartItems()
	const { data: quote, isLoading: isFetchingQuote, isError: failedFetchQuotation } = useGetQuote()

	const totalPrice = cartItems && quote?.price && cartItems?.length * quote?.price

	const contractWrite = useContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'borrow',
		args: [
			[...(cartItems || [])],
			new BigNumber(totalPrice || 0).multipliedBy(1e18).toString(),
			quote?.deadline,
			quote?.signature?.v,
			quote?.signature?.r,
			quote?.signature?.s
		],
		overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toString() }
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			if (data?.status === 1) {
				localStorage.setItem('tubbylend', JSON.stringify({})) // clear items in cart if tx is successfull
			}
		}
	})

	return {
		...contractWrite,
		waitForTransaction,
		mutationDisabled: fetchingCartItems || isFetchingQuote || failedToFetchCartItems || failedFetchQuotation
	}
}
