import { useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { LOCAL_STORAGE_KEY } from '~/lib/constants'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'
import { useGetCartItems } from './useCart'
import { useGetLoans } from './useLoans'
import { useGetNftsList } from './useNftsList'
import { useGetQuote } from './useQuotation'

const contract = NFT_TESTNET_ADDRESS

export function useBorrow() {
	const { data: cartItems, isLoading: fetchingCartItems, isError: failedToFetchCartItems } = useGetCartItems()
	const { data: quote, isLoading: isFetchingQuote, isError: failedFetchQuotation } = useGetQuote()
	const router = useRouter()

	const queryClient = useQueryClient()
	const { refetch: refetchNftsList } = useGetNftsList('borrow')
	const { refetch: refetchLoans } = useGetLoans()
	const { chain } = useNetwork()

	const blockExplorerUrl = chain?.blockExplorers?.default.url ?? 'https://etherscan.io'

	const cartTokenIds = cartItems?.map((item) => item.tokenId) ?? []

	const { config } = usePrepareContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'borrow',
		args: [
			[...cartTokenIds],
			new BigNumber(quote?.price ?? 0).times(1e18).toFixed(0),
			quote?.deadline,
			quote?.signature?.v,
			quote?.signature?.r,
			quote?.signature?.s
		]
		// overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0) }
	})

	const contractWrite = useContractWrite(config)

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			refetchNftsList()
			refetchLoans()

			if (data?.status === 1) {
				const tubbies = contractWrite.variables?.args?.[0].length
				const price = contractWrite.variables?.args?.[1]
				const total = new BigNumber(price).times(tubbies).div(1e18).toFixed(0)

				toast.success(
					() => {
						return (
							<div className="toastWithLink">
								<span>{`Borrow ${total} ETH`}</span>
								<a
									href={blockExplorerUrl + '/tx/' + contractWrite.data?.hash}
									target="_blank"
									rel="noopener noreferrer"
								>
									View on Etherscan
								</a>
							</div>
						)
					},
					{
						duration: 5000
					}
				)

				// clear items in cart if tx is successfull
				const prevItems = localStorage.getItem(LOCAL_STORAGE_KEY)

				if (prevItems) {
					const items = JSON.parse(prevItems)
					localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...items, [contract]: [] }))
				} else {
					localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ [contract]: [] }))
				}

				router.push('/')
			} else {
				toast.error(
					() => {
						return (
							<div className="toastWithLink">
								<span>Transaction Failed</span>
								<a
									href={blockExplorerUrl + '/tx/' + contractWrite.data?.hash}
									target="_blank"
									rel="noopener noreferrer"
								>
									View on Etherscan
								</a>
							</div>
						)
					},
					{
						duration: 5000
					}
				)
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
