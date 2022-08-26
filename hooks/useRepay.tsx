import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DisclosureState } from 'ariakit'
import BigNumber from 'bignumber.js'
import toast from 'react-hot-toast'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import { useGetLoans } from './useLoans'

interface IUseRepayProps {
	loanId: number
	amount: number
	txDialog: DisclosureState
	transactionHash: React.MutableRefObject<string | null>
}
export function useRepay({ loanId, amount, txDialog, transactionHash }: IUseRepayProps) {
	const { refetch: refetchLoans } = useGetLoans()
	const { chain } = useNetwork()

	const blockExplorerUrl = chain?.blockExplorers?.default.url ?? 'https://etherscan.io'

	const contracts = chainConfig[chain?.id ?? 1]

	const queryClient = useQueryClient()

	const buffer = new BigNumber(amount).times(0.05).toFixed(0)

	const { config } = usePrepareContractWrite({
		addressOrName: contracts.lendingAddress,
		contractInterface: contracts.lendingABI,
		functionName: 'repay',
		args: [loanId],
		overrides: {
			value: new BigNumber(amount).plus(buffer).toFixed(0)
			// gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0)
		}
	})

	const contractWrite = useContractWrite({
		...config,
		onSuccess: (data) => {
			transactionHash.current = data.hash
			txDialog.toggle()
		}
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSuccess: () => {
			refetchLoans()
		},
		onSettled: (data) => {
			queryClient.invalidateQueries()

			const paidAmount = contractWrite.variables?.overrides?.value

			if (data?.status === 1) {
				toast.success(
					() => {
						return (
							<div className="toastWithLink">
								<span>{`Repay ${new BigNumber(Number(paidAmount)).div(1e18).toFixed(3)} ETH`}</span>
								<a
									href={blockExplorerUrl + '/tx/' + contractWrite.data?.hash}
									target="_blank"
									rel="noopener noreferrer"
								>
									View on Etherscan
								</a>
							</div>
						)
					},
					{
						duration: 5000
					}
				)
			} else {
				toast.error(
					() => {
						return (
							<div className="toastWithLink">
								<span>Transaction Failed</span>
								<a
									href={blockExplorerUrl + '/tx/' + contractWrite.data?.hash}
									target="_blank"
									rel="noopener noreferrer"
								>
									View on Etherscan
								</a>
							</div>
						)
					},
					{
						duration: 5000
					}
				)
			}
		}
	})

	return {
		...contractWrite,
		waitForTransaction
	}
}
