import { ethers } from 'ethers'
import { erc721ABI, useAccount, useNetwork, useProvider, useQuery } from 'wagmi'
import { NFT_TESTNET_ADDRESS } from '~/lib/contracts'

type Provider = ethers.providers.BaseProvider

async function getNfts({ tokenId, provider }: { tokenId: number; provider: Provider }) {
	try {
		if (!tokenId) throw new Error('Error: Invalid arguments')

		const tubbyContract = new ethers.Contract(NFT_TESTNET_ADDRESS, erc721ABI, provider)

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

	return useQuery(['nft', address, chain, tokenId], () => getNfts({ tokenId, provider }))
}
