import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import type { IError, Provider } from './types'
import { getOwnedNfts } from './useNftsList'

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
	chainId?: number
}

async function getLoans({ userAddress, provider, chainId }: IGetLoans) {
	try {
		if (!userAddress || !provider || !chainId) throw new Error('Invalid arguments')

		const contracts = chainConfig[chainId]

		const loanContract = new ethers.Contract(contracts.lendingAddress, contracts.lendingABI, provider)

		const nftsList = await getOwnedNfts({ userAddress, chainId, type: 'repay' })

		const loans = await Promise.all(nftsList.map((item) => loanContract.loans(new BigNumber(item.tokenId).toString())))

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

	return useQuery<Array<ILoan>, IError>(
		['loansToRepay', address, chain?.id],
		() => getLoans({ userAddress: address, provider, chainId: chain?.id }),
		{
			refetchInterval: 60 * 100
		}
	)
}
