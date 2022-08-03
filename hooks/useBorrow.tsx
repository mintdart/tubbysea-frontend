import { useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'
import { useGetCartItems } from './useCart'
import { useGetLoans } from './useLoans'
import { useGetNftsList } from './useNftsList'
import { useGetQuote } from './useQuotation'

const contract = NFT_TESTNET_ADDRESS

export function useBorrow() {
	const { data: cartItems, isLoading: fetchingCartItems, isError: failedToFetchCartItems } = useGetCartItems()
	const { data: quote, isLoading: isFetchingQuote, isError: failedFetchQuotation } = useGetQuote()

	const queryClient = useQueryClient()
	const { refetch: refetchNftsList } = useGetNftsList('borrow')
	const { refetch: refetchLoans } = useGetLoans()

	const cartTokenIds = cartItems?.map((item) => item.tokenId) ?? []

	const { config } = usePrepareContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'borrow',
		args: [
			[...cartTokenIds],
			new BigNumber(quote?.price ?? 0).times(1e18).toString(),
			quote?.deadline,
			quote?.signature?.v,
			quote?.signature?.r,
			quote?.signature?.s
		],
		overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toString() }
	})

	const contractWrite = useContractWrite({ ...config })

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			refetchNftsList()
			refetchLoans()

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

			queryClient.invalidateQueries()
		}
	})

	return {
		...contractWrite,
		waitForTransaction,
		mutationDisabled: fetchingCartItems || isFetchingQuote || failedToFetchCartItems || failedFetchQuotation
	}
}
