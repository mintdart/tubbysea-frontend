import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

function fetchCartItems(contract: string) {
	const prevItems = JSON.parse(localStorage.getItem('tubbylend') || '')

	return prevItems[contract] || []
}

const useSaveItemToCart = () => {
	const queryClient = useQueryClient()

	return useMutation(saveItemToCart, {
		onSettled: () => {
			queryClient.invalidateQueries()
		}
	})
}

const useGetCartItems = (contract: string) => {
	return useQuery<Array<string | number>>(['cartItems', contract], () => fetchCartItems(contract))
}

export { useSaveItemToCart, useGetCartItems }
