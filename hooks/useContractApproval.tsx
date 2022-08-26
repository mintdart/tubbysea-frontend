import {
	erc721ABI,
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
	usePrepareContractWrite,
	useWaitForTransaction
} from 'wagmi'
import toast from 'react-hot-toast'
import { chainConfig } from '~/lib/constants'

export function useSetContractApproval(refetchBorrowContract: () => void) {
	const { chain } = useNetwork()
	const blockExplorerUrl = chain?.blockExplorers?.default.url ?? 'https://etherscan.io'
	const contracts = chainConfig[chain?.id ?? 1]

	const { config } = usePrepareContractWrite({
		addressOrName: contracts.collateralAddress,
		contractInterface: erc721ABI,
		functionName: 'setApprovalForAll',
		args: [contracts.lendingAddress, true]
		// overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0) }
	})

	const contractWrite = useContractWrite(config)

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			if (data?.status === 0) {
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

			refetchBorrowContract()
		}
	})

	return { ...contractWrite, waitForTransaction }
}

export function useGetContractApproval() {
	const { address } = useAccount()
	const { chain } = useNetwork()
	const contracts = chainConfig[chain?.id ?? 1]

	return useContractRead({
		addressOrName: contracts.collateralAddress,
		contractInterface: erc721ABI,
		functionName: 'isApprovedForAll',
		args: [address, contracts.lendingAddress]
	})
}
