import { useAccount, useContractRead } from 'wagmi'
import { NFTS_LIST_ABI, NFTS_LIST_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'
import { formatNftsListResponse } from './utils'

export function useGetNfts() {
	const { address } = useAccount()

	// get number of nft's owned by user of a given contract
	return useContractRead({
		addressOrName: NFTS_LIST_ADDRESS,
		contractInterface: NFTS_LIST_ABI,
		functionName: 'getOwnedNfts',
		args: [address, NFT_TESTNET_ADDRESS, 920600, 920800],
		select: (data: any) => formatNftsListResponse(data),
		watch: true
	})
}
