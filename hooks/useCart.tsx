import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'
import { ICart, IError, INftItem } from './types'
import { useGetNftsList } from './useNftsList'

// save/remove items from local storage
async function saveItemToCart({ chainId, tokenId }: { chainId?: number; tokenId: number }) {
	try {
		const contract = chainId ? chainConfig[chainId]?.borrowNftAddress : null

		if (!contract) {
			throw new Error("Error: Couldn't get contract address of nft collection")
		}

		const prevItems = localStorage.getItem(LOCAL_STORAGE_KEY)

		if (prevItems) {
			const items = JSON.parse(prevItems)

			const contractItems: Array<number> = items[contract] || []

			if (contractItems.includes(tokenId)) {
				items[contract] = contractItems.filter((item) => item !== tokenId)
			} else {
				items[contract] = [...contractItems, tokenId]
			}

			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
		} else {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ [contract]: [tokenId] }))
		}

		return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')
	} catch (error: any) {
		throw new Error("Couldn't add item to cart")
	}
}

// get cart items from local storage
async function fetchCartItems({ chainId, tubbies }: { chainId?: number; tubbies?: Array<INftItem> }) {
	try {
		const contract = chainId ? chainConfig[chainId]?.borrowNftAddress : null

		if (!contract) {
			throw new Error("Error: Couldn't get contract address of nft collection")
		}

		const prevItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

		const itemsInStorage: Array<number> = prevItems[contract] || []

		return itemsInStorage
			.map((item) => {
				const tubby = tubbies?.find((t) => t.tokenId === item)

				return tubby || null
			})
			.filter((item) => item) as Array<INftItem>
	} catch (error: any) {
		throw new Error("Couldn't get items in cart")
	}
}

// *------------------------------------------------*

const useSaveItemToCart = () => {
	const queryClient = useQueryClient()

	const { chain } = useNetwork()

	const router = useRouter()

	return useMutation(({ tokenId }: { tokenId: number }) => saveItemToCart({ chainId: chain?.id, tokenId }), {
		onMutate: () => {
			const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

			const contractAddress: string | undefined | null = chain?.id ? chainConfig[chain.id]?.borrowNftAddress : null

			return contractAddress ? cart[contractAddress] || [] : []
		},
		onSuccess: (data: ICart, _variables, prevItems) => {
			const contractAddress: string | undefined | null = chain?.id ? chainConfig[chain.id]?.borrowNftAddress : null

			// If its the first item added to cart, show cart section
			if (contractAddress && data[contractAddress]?.length === 1 && data[contractAddress]?.length > prevItems.length) {
				router.push('/?cart=true')
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries()
		}
	})
}

const useGetCartItems = () => {
	const { address } = useAccount()
	const { chain } = useNetwork()
	const { data: tubbies } = useGetNftsList('borrow')

	// fetch and filter cart items which are owned by user
	return useQuery<Array<INftItem>, IError>(['cartItems', address, chain?.id, tubbies?.length], () =>
		fetchCartItems({ chainId: chain?.id, tubbies })
	)
}

export { useSaveItemToCart, useGetCartItems }
