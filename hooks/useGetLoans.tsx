import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { NFTS_LIST_ABI, NFTS_LIST_ADDRESS, TUBBY_LOAN_ADDRESS } from '~/lib/contracts'
import { TUBBY_LOAN_ABI } from '~/lib/contracts/tubbyLoan.abi'
import { formatNftsListResponse } from './utils'

type Provider = ethers.providers.BaseProvider

export interface ILoan {
	loanId: number
	borrowed: number
	nft: number
	startInterestSum: number
	startTime: number
	maxLoanLength: number
}

interface IError {
	message?: string
}

async function getLoans(userAddress: string | null, provider: Provider) {
	try {
		if (!userAddress) throw new Error('Wallet not connected')

		const nftListContract = new ethers.Contract(NFTS_LIST_ADDRESS, NFTS_LIST_ABI, provider)
		const loanContract = new ethers.Contract(TUBBY_LOAN_ADDRESS, TUBBY_LOAN_ABI, provider)

		const list = await nftListContract.getOwnedNfts(userAddress, TUBBY_LOAN_ADDRESS, 0, 2)
		const nftsList = formatNftsListResponse(list)

		const loans = await Promise.all(nftsList.map((id) => loanContract.loans(id)))

		const maxLoanLength = await loanContract.maxLoanLength()

		return loans.map((loan, index) => ({
			loanId: nftsList[index],
			borrowed: Number(loan.borrowed.toString()),
			nft: Number(loan.nft.toString()),
			startInterestSum: Number(loan.startInterestSum.toString()),
			startTime: Number(loan.startTime.toString()) * 1000,
			maxLoanLength: Number(maxLoanLength.toString()) * 1000
		}))
	} catch (error: any) {
		console.log(error)
		throw new Error(error.message || (error?.reason ?? "Couldn't get loans of user"))
	}
}

export function useGetLoans() {
	const { address } = useAccount()
	const provider = useProvider()
	const { chain } = useNetwork()
	return useQuery<ILoan[], IError>(['loans', address, chain], () => getLoans(address || null, provider), {
		refetchInterval: 20 * 100
	})
}
