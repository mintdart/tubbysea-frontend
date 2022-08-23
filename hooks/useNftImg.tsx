import { ethers } from 'ethers'
import { erc721ABI, useAccount, useNetwork, useProvider, useQuery } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import type { Provider } from './types'

async function getNfts({ tokenId, provider, chainId }: { tokenId: number; provider: Provider; chainId?: number }) {
	try {
		if (!tokenId || !provider || !chainId) throw new Error('Error: Invalid arguments')

		const contracts = chainConfig[chainId]

		const tubbyContract = new ethers.Contract(contracts.collateralAddress, erc721ABI, provider)

		const tokenURI = await tubbyContract.tokenURI(tokenId)

		const metadata = await fetch(`https://cloudflare-ipfs.com/${tokenURI.split('https://ipfs.io/')[1]}`).then((res) =>
			res.json()
		)

		return metadata.image.split('https://ipfs.io/')[1]
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get metadata"))
	}
}

export function useGetNftImg(tokenId: number) {
	const { address } = useAccount()
	const provider = useProvider()
	const { chain } = useNetwork()

	return useQuery(['nft', address, chain?.id, tokenId], () => getNfts({ tokenId, provider, chainId: chain?.id }))
}
