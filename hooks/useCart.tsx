import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount, useNetwork } from 'wagmi'
import { NFT_TESTNET_ADDRESS } from '~/lib/contracts'
import { IError, INftItem } from './types'
import { useGetNfts } from './useGetNfts'

const contract = NFT_TESTNET_ADDRESS

// save/remove items from local storage
function saveItemToCart({ contract, tokenId }: { contract: string; tokenId: number }) {
	const prevItems = localStorage.getItem('tubbylend')

	if (prevItems) {
		const items = JSON.parse(prevItems)

		const contractItems: Array<number> = items[contract] || []

		if (contractItems.includes(tokenId)) {
			items[contract] = contractItems.filter((item) => item !== tokenId)
		} else {
			items[contract] = [...contractItems, tokenId]
		}

		localStorage.setItem('tubbylend', JSON.stringify(items))
	} else {
		localStorage.setItem('tubbylend', JSON.stringify({ [contract]: [tokenId] }))
	}

	return JSON.parse(localStorage.getItem('tubbylend') || '')
}

// get cart items from local storage
function fetchCartItems(contract: string, tubbies?: Array<INftItem>) {
	const prevItems = JSON.parse(localStorage.getItem('tubbylend') || '')

	const itemsInStorage: Array<number> = prevItems[contract] || []

	return itemsInStorage.map((item) => {
		const tubby = tubbies?.find((t) => t.tokenId === item)

		return tubby || null
	}) as Array<INftItem>
}

// *------------------------------------------------*

const useSaveItemToCart = () => {
	const queryClient = useQueryClient()

	return useMutation(({ tokenId }: { tokenId: number }) => saveItemToCart({ contract, tokenId }), {
		onSettled: () => {
			queryClient.invalidateQueries()
		}
	})
}

const useGetCartItems = () => {
	const { address } = useAccount()
	const { chain } = useNetwork()
	const { data: tubbies, isLoading } = useGetNfts()

	// fetch and filter cart items which are owned by user
	return useQuery<Array<INftItem>, IError>(
		['cartItems', contract, address, chain?.id, tubbies?.length, isLoading],
		() => fetchCartItems(contract, tubbies)
	)
}

export { useSaveItemToCart, useGetCartItems }
