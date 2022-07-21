import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NFT_TESTNET_CONTRACT } from '~/lib/contracts'
import { useGetNfts } from './useGetNfts'

const contract = NFT_TESTNET_CONTRACT

// save/remove items from local storage
function saveItemToCart({ contract, tokenId }: { contract: string; tokenId: string | number }) {
	const prevItems = localStorage.getItem('tubbylend')

	if (prevItems) {
		const items = JSON.parse(prevItems)

		const contractItems: Array<string | number> = items[contract] || []

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
function fetchCartItems(contract: string) {
	const prevItems = JSON.parse(localStorage.getItem('tubbylend') || '')

	return prevItems[contract] || []
}

// *------------------------------------------------*

const useSaveItemToCart = () => {
	const queryClient = useQueryClient()

	return useMutation(({ tokenId }: { tokenId: string | number }) => saveItemToCart({ contract, tokenId }), {
		onSettled: () => {
			queryClient.invalidateQueries()
		}
	})
}

const useGetCartItems = () => {
	const { data: tubbies } = useGetNfts()

	// fetch and filter cart items which are owned by user
	return useQuery<Array<string | number>>(['cartItems', contract, tubbies?.length], () => fetchCartItems(contract), {
		select: (data) => {
			return data.filter((item) => tubbies?.includes(item))
		}
	})
}

export { useSaveItemToCart, useGetCartItems }
