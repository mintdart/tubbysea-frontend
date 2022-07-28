import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { useAccount, useContractReads, useNetwork, useProvider } from 'wagmi'
import { NFTS_LIST_ABI, NFTS_LIST_ADDRESS, TUBBY_LOAN_ADDRESS } from '~/lib/contracts'
import { TUBBY_LOAN_ABI } from '~/lib/contracts/tubbyLoan.abi'
import { formatNftsListResponse } from './utils'

type Provider = ethers.providers.BaseProvider

export interface ILoan {
	loanId: number
	nft: number
	deadline: number
	totalRepay: number
}

interface IError {
	message?: string
}

interface IGetLoans {
	userAddress?: string
	provider: Provider
	totalSupply?: number
	maxLoanLength?: number
}

async function getLoans({ userAddress, provider, totalSupply, maxLoanLength }: IGetLoans) {
	try {
		if (!userAddress || !provider || !totalSupply || !maxLoanLength) throw new Error('Invalid arguments')

		const nftListContract = new ethers.Contract(NFTS_LIST_ADDRESS, NFTS_LIST_ABI, provider)
		const loanContract = new ethers.Contract(TUBBY_LOAN_ADDRESS, TUBBY_LOAN_ABI, provider)

		const list = await nftListContract.getOwnedNfts(userAddress, TUBBY_LOAN_ADDRESS, 0, totalSupply)
		const nftsList = formatNftsListResponse(list)

		const loans = await Promise.all(nftsList.map((id) => loanContract.loans(id)))
		const infoToRepayLoans = await Promise.all(nftsList.map((id) => loanContract.infoToRepayLoan(id)))

		return loans.map((loan, index) => ({
			loanId: nftsList[index],
			nft: Number(loan.nft),
			deadline: Number(infoToRepayLoans[index].deadline) * 1000,
			totalRepay: Number(infoToRepayLoans[index].totalRepay) / 1e18
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

	const { data } = useContractReads({
		contracts: [
			{
				addressOrName: TUBBY_LOAN_ADDRESS,
				contractInterface: TUBBY_LOAN_ABI,
				functionName: 'totalSupply'
			},
			{
				addressOrName: TUBBY_LOAN_ADDRESS,
				contractInterface: TUBBY_LOAN_ABI,
				functionName: 'maxLoanLength'
			}
		],
		watch: true
	})

	const [totalSupply, maxLoanLength] = transformLoanTokenData(data)

	return useQuery<ILoan[], IError>(
		['loans', address, chain, totalSupply, maxLoanLength],
		() => getLoans({ userAddress: address, provider, totalSupply, maxLoanLength }),
		{
			retry: 0,
			refetchOnWindowFocus: false
		}
	)
}

const transformLoanTokenData = (data: any): number[] => {
	return data ? [data[0] && Number(data[0].toString()), data[1] && Number(data[1].toString()) * 1000] : []
}
