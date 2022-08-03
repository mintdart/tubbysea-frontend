import { useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS } from '~/lib/contracts'
import { useGetLoans } from './useLoans'
import { useGetNftsList } from './useNftsList'

export function useRepay(loanId: number, amount: number) {
	const { refetch: refetchNftsList } = useGetNftsList('repay')
	const { refetch: refetchLoans } = useGetLoans()

	const queryClient = useQueryClient()

	const buffer = new BigNumber(amount).times(0.05).toString()

	const { config } = usePrepareContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'repay',
		args: [loanId],
		overrides: {
			value: new BigNumber(amount).plus(buffer).toString(),
			gasLimit: new BigNumber(0.0005).times(1e9).toString()
		}
	})

	const contractWrite = useContractWrite({ ...config })

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: () => {
			refetchLoans()
			refetchNftsList()
			queryClient.invalidateQueries()
		}
	})

	return {
		...contractWrite,
		waitForTransaction
	}
}
