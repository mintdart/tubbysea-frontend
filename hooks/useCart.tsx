import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'
import { ICart, IError, INftItem } from './types'
import { useGetNftsList } from './useNftsList'

// save/remove items from local storage
async function saveItemToCart({
	chainId,
	tokenId,
	cartType
}: {
	chainId?: number
	tokenId: number
	cartType: 'borrow' | 'repay'
}) {
	try {
		const contract = chainId ? chainConfig[chainId]?.collateralAddress : null

		if (!contract) {
			throw new Error("Error: Couldn't get contract address of nft collection")
		}

		const storage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

		const items = storage?.[cartType]

		if (items) {
			const contractItems: Array<number> = items[contract] || []

			if (contractItems.includes(tokenId)) {
				// removes items from cart
				items[contract] = contractItems.filter((item) => item !== tokenId)
			} else {
				// adds items to cart
				items[contract] = [...contractItems, tokenId]
			}

			// updates local storage with items
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...storage, [cartType]: items }))
		} else {
			// initialise storage
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...storage, [cartType]: { [contract]: [tokenId] } }))
		}

		// returns items of given cart type
		return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')[cartType]
	} catch (error: any) {
		throw new Error("Couldn't add item to cart")
	}
}

// get cart items from local storage
async function fetchCartItems({
	chainId,
	tubbies,
	cartType
}: {
	chainId?: number
	tubbies?: Array<INftItem>
	cartType: 'borrow' | 'repay'
}) {
	try {
		const contract = chainId ? chainConfig[chainId]?.collateralAddress : null

		if (!contract) {
			throw new Error("Error: Couldn't get contract address of nft collection")
		}

		const prevItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

		const itemsInStorage: Array<number> = prevItems?.[cartType]?.[contract] ?? []

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

	return useMutation(
		({ tokenId, cartType }: { tokenId: number; cartType: 'borrow' | 'repay' }) =>
			saveItemToCart({ chainId: chain?.id, tokenId, cartType }),
		{
			onMutate: ({ cartType }) => {
				const cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

				const contractAddress: string | undefined | null = chain?.id ? chainConfig[chain.id]?.collateralAddress : null

				return contractAddress ? cart?.[cartType]?.[contractAddress] ?? [] : []
			},
			onSuccess: (data: ICart, _variables, prevItems) => {
				const contractAddress: string | undefined | null = chain?.id ? chainConfig[chain.id]?.collateralAddress : null

				// If its the first item added to cart, show cart section
				if (
					contractAddress &&
					data[contractAddress]?.length === 1 &&
					data[contractAddress]?.length > prevItems.length
				) {
					router.push({
						pathname: router.pathname,
						query: {
							cart: true
						}
					})
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries()
			}
		}
	)
}

const useGetCartItems = (cartType: 'borrow' | 'repay') => {
	const { address } = useAccount()
	const { chain } = useNetwork()
	const { data: tubbies } = useGetNftsList('borrow')

	// fetch and filter cart items which are owned by user
	return useQuery<Array<INftItem>, IError>(['cartItems', cartType, address, chain?.id, tubbies?.length], () =>
		fetchCartItems({ chainId: chain?.id, tubbies, cartType })
	)
}

export { useSaveItemToCart, useGetCartItems }
