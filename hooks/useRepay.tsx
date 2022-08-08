import { useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import toast from 'react-hot-toast'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS } from '~/lib/contracts'
import { useGetLoans } from './useLoans'
import { useGetNftsList } from './useNftsList'

// TODO check for bignumber decimal error
export function useRepay(loanId: number, amount: number) {
	const { refetch: refetchNftsList } = useGetNftsList('repay')
	const { refetch: refetchLoans } = useGetLoans()
	const { chain } = useNetwork()

	const blockExplorerUrl = chain?.blockExplorers?.default.url ?? 'https://etherscan.io'

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
		},
		onSettled: () => {
			queryClient.invalidateQueries()
		}
	})

	const contractWrite = useContractWrite({ ...config })

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			refetchLoans()
			refetchNftsList()

			const paidAmount = contractWrite.variables?.overrides?.value

			if (data?.status === 1 && paidAmount) {
				toast.success(() => {
					return (
						<div className="toastWithLink">
							<span>{`Repay ${new BigNumber(Number(paidAmount)).div(1e18).toFixed(3)} ETH`}</span>
							<a href={blockExplorerUrl + '/tx/' + contractWrite.data?.hash} target="_blank" rel="noopener noreferrer">
								View on Etherscan
							</a>
						</div>
					)
				})
			} else {
				toast.error(() => {
					return (
						<div className="toastWithLink">
							<span>Transaction Failed</span>
							<a href={blockExplorerUrl + '/tx/' + contractWrite.data?.hash} target="_blank" rel="noopener noreferrer">
								View on Etherscan
							</a>
						</div>
					)
				})
			}

			queryClient.invalidateQueries()
		}
	})

	return {
		...contractWrite,
		waitForTransaction
	}
}
