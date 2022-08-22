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
import { LENDING_POOL_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'

export function useSetContractApproval() {
	const { chain } = useNetwork()
	const blockExplorerUrl = chain?.blockExplorers?.default.url ?? 'https://etherscan.io'

	const { config } = usePrepareContractWrite({
		addressOrName: NFT_TESTNET_ADDRESS,
		contractInterface: erc721ABI,
		functionName: 'setApprovalForAll',
		args: [LENDING_POOL_ADDRESS, true]
		// overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0) }
	})

	const contractWrite = useContractWrite({ ...config })

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
		}
	})

	return { ...contractWrite, waitForTransaction }
}

export function useGetContractApproval() {
	const { address } = useAccount()

	return useContractRead({
		addressOrName: NFT_TESTNET_ADDRESS,
		contractInterface: erc721ABI,
		functionName: 'isApprovedForAll',
		args: [address, LENDING_POOL_ADDRESS]
	})
}
