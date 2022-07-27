import { useAccount, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { NFTS_LIST_ABI, NFTS_LIST_ADDRESS, TUBBY_LOAN_ADDRESS } from '~/lib/contracts'

export function useGetLoans() {
	const { address } = useAccount()

	// get number of nft's owned by user of a given contract
	return useContractRead({
		addressOrName: NFTS_LIST_ADDRESS,
		contractInterface: NFTS_LIST_ABI,
		functionName: 'getOwnedNfts',
		args: [address, TUBBY_LOAN_ADDRESS, 0, 2],
		select: (data: any) => transformData(data),
		watch: true
	})
}

const transformData = (data: [BigNumber[], BigNumber]) => {
	return data ? data[0].slice(0, Number(data[1].toString())).map((item: BigNumber) => Number(item.toString())) : []
}
