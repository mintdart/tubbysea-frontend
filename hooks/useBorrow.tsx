import BigNumber from 'bignumber.js'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'
import { useGetCartItems } from './useCart'
import { useGetQuote } from './useGetQuote'

const contract = NFT_TESTNET_ADDRESS

export function useBorrow() {
	const { data: cartItems, isLoading: fetchingCartItems, isError: failedToFetchCartItems } = useGetCartItems()
	const { data: quote, isLoading: isFetchingQuote, isError: failedFetchQuotation } = useGetQuote()

	const contractWrite = useContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'borrow',
		args: [
			[...(cartItems || [])],
			new BigNumber(quote?.price ?? 0).times(1e18).toString(),
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
			// clear items in cart if tx is successfull
			if (data?.status === 1) {
				const prevItems = localStorage.getItem('tubbylend')

				if (prevItems) {
					const items = JSON.parse(prevItems)
					localStorage.setItem('tubbylend', JSON.stringify({ ...items, [contract]: [] }))
				} else {
					localStorage.setItem('tubbylend', JSON.stringify({ [contract]: [] }))
				}
			}
		}
	})

	return {
		...contractWrite,
		waitForTransaction,
		mutationDisabled: fetchingCartItems || isFetchingQuote || failedToFetchCartItems || failedFetchQuotation
	}
}
