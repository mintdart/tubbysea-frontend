import { useQuery } from '@tanstack/react-query'
import { useAccount, useNetwork } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import type { IError, INftApiResponse, INftItem } from './types'

interface IGetOwnedNfts {
	address?: string
	chainId?: number
}

async function getOwnedNfts({ address, chainId }: IGetOwnedNfts): Promise<Array<INftItem>> {
	try {
		if (!address || !chainId || !chainConfig[chainId]) {
			throw new Error('Error: Invalid arguments')
		}

		const data: INftApiResponse = await fetch(
			`${chainConfig[chainId].alchemyNftUrl}/?owner=${address}&contractAddresses[]=${chainConfig[chainId].nftContractAddress}`
		).then((res) => res.json())

		return data?.ownedNfts.map((item) => ({
			tokenId: Number(item.id.tokenId),
			imgUrl: `https://cloudflare-ipfs.com/` + item.metadata.image.split('https://ipfs.io/')[1]
		}))
	} catch (error: any) {
		console.log(error)
		throw new Error(error.message || (error?.reason ?? "Couldn't get nfts of user"))
	}
}

export function useGetNfts() {
	const { address } = useAccount()
	const { chain } = useNetwork()

	return useQuery<Array<INftItem>, IError>(['nftsList', address, chain?.id], () =>
		getOwnedNfts({ address, chainId: chain?.id })
	)
}
