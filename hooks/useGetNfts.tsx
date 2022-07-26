import { useAccount, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { NFTS_LIST_ABI, NFTS_LIST_CONTRACT, NFT_TESTNET_CONTRACT } from '~/lib/contracts'

export function useGetNfts() {
	const { address } = useAccount()

	// get number of nft's owned by user of a given contract
	return useContractRead({
		addressOrName: NFTS_LIST_CONTRACT,
		contractInterface: NFTS_LIST_ABI,
		functionName: 'getOwnedNfts',
		args: [address, NFT_TESTNET_CONTRACT, 920600, 920800],
		select: (data: any) => transformData(data)
	})
}

const transformData = (data: [BigNumber[]]) => {
	return data
		? data[0]
				.map((item: BigNumber) => Number(item.toString()))
				.filter((item: number) => item !== 0 && !Number.isNaN(item))
		: []
}
