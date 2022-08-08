import { useQuery } from '@tanstack/react-query'
import { useAccount, useNetwork } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import type { IError, INftApiResponse, INftItem } from './types'

interface IGetOwnedNfts {
	userAddress?: string
	chainId?: number
	type: string
}

async function getOwnedNfts({ userAddress, chainId, type }: IGetOwnedNfts): Promise<Array<INftItem>> {
	try {
		if (!userAddress || !chainId || !chainConfig[chainId]) {
			throw new Error('Error: Invalid arguments')
		}

		const data: INftApiResponse = await fetch(
			`${chainConfig[chainId].alchemyNftUrl}/?owner=${userAddress}&contractAddresses[]=${
				type === 'repay' ? chainConfig[chainId].repayNftAddress : chainConfig[chainId].borrowNftAddress
			}`
		).then((res) => res.json())

		return data?.ownedNfts.map((item) => ({
			tokenId: Number(item.id.tokenId),
			imgUrl: item.metadata.image
				? `https://cloudflare-ipfs.com/` + item.metadata.image.split('https://ipfs.io/')[1]
				: '/tubbycats.png'
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get nfts of user"))
	}
}

export function useGetNftsList(type: 'borrow' | 'repay') {
	const { address: userAddress } = useAccount()
	const { chain } = useNetwork()

	return useQuery<Array<INftItem>, IError>(['nftsList', userAddress, chain?.id, type], () =>
		getOwnedNfts({ userAddress, chainId: chain?.id, type })
	)
}
