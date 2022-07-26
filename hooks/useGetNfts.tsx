import { useAccount, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { NFTS_LIST_ABI, NFTS_LIST_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'

export function useGetNfts() {
	const { address } = useAccount()

	// get number of nft's owned by user of a given contract
	return useContractRead({
		addressOrName: NFTS_LIST_ADDRESS,
		contractInterface: NFTS_LIST_ABI,
		functionName: 'getOwnedNfts',
		args: [address, NFT_TESTNET_ADDRESS, 920600, 920800],
		select: (data: any) => transformData(data),
		watch: true
	})
}

const transformData = (data: [BigNumber[]]) => {
	return data
		? data[0]
				.map((item: BigNumber) => Number(item.toString()))
				.filter((item: number) => item !== 0 && !Number.isNaN(item))
		: []
}
