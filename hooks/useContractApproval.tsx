import {
	erc721ABI,
	useAccount,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction
} from 'wagmi'
import { LENDING_POOL_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'

export function useSetContractApproval() {
	const { config } = usePrepareContractWrite({
		addressOrName: NFT_TESTNET_ADDRESS,
		contractInterface: erc721ABI,
		functionName: 'setApprovalForAll',
		args: [LENDING_POOL_ADDRESS, true]
		// overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0) }
	})

	const contractWrite = useContractWrite({ ...config })

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash
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
