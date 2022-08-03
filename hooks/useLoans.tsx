import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from '~/lib/contracts'
import type { IError, INftItem, Provider } from './types'
import { useGetNftsList } from './useNftsList'

export interface ILoan {
	loanId: number
	imgUrl: string
	nft: number
	deadline: number
	totalRepay: number
}

interface IGetLoans {
	userAddress?: string
	provider: Provider
	nftsList?: Array<INftItem>
}

async function getLoans({ userAddress, provider, nftsList }: IGetLoans) {
	try {
		if (!userAddress || !provider || !nftsList) throw new Error('Invalid arguments')

		const loanContract = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, provider)

		const loans = await Promise.all(nftsList.map((item) => loanContract.loans(item.tokenId)))

		const infoToRepayLoans = await Promise.all(nftsList.map((item) => loanContract.infoToRepayLoan(item.tokenId)))

		return loans.map((loan, index) => ({
			loanId: nftsList[index].tokenId,
			imgUrl: nftsList[index].imgUrl,
			nft: Number(loan.nft),
			deadline: Number(infoToRepayLoans[index].deadline) * 1000,
			totalRepay: Number(infoToRepayLoans[index].totalRepay)
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get loans of user"))
	}
}

export function useGetLoans() {
	const { address } = useAccount()
	const provider = useProvider()
	const { chain } = useNetwork()

	const { data: nftsList, isLoading: fetchingNfts } = useGetNftsList()

	return useQuery<Array<ILoan>, IError>(
		['loans', address, chain?.id, fetchingNfts],
		() => getLoans({ userAddress: address, provider, nftsList }),
		{
			retry: 2,
			refetchOnWindowFocus: false
		}
	)
}
