import { useMutation } from '@tanstack/react-query'

function saveItemToBorrow({ contract, tokenId }: { contract: string; tokenId: string | number }) {
	const prevItems = localStorage.getItem('tubbylend')

	if (prevItems) {
		const items = JSON.parse(prevItems)

		const contractItems: Array<string | number> = items[contract] || []

		if (contractItems.includes(tokenId)) {
			items[contract] = contractItems.filter((item) => item === tokenId)
		} else {
			items[contract] = [...contractItems, tokenId]
		}

		localStorage.setItem('tubbylend', JSON.stringify(items))
	} else {
		localStorage.setItem('tubbylend', JSON.stringify({ [contract]: [tokenId] }))
	}

	return JSON.parse(localStorage.getItem('tubbylend') || '')
}

const useSaveItemToBorrow = () => {
	return useMutation(saveItemToBorrow)
}

export { useSaveItemToBorrow, saveItemToBorrow }
