import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS, NFT_TESTNET_ADDRESS } from '~/lib/contracts'

export function useSetContractApproval() {
	const { address } = useAccount()

	const contractWrite = useContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'setApprovalForAll',
		args: [address, true],
		overrides: { gasLimit: 1e7 }
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash
	})

	return { ...contractWrite, waitForTransaction }
}

export function useGetContractApproval() {
	const { address } = useAccount()

	return useContractRead({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'isApprovedForAll',
		args: [address, NFT_TESTNET_ADDRESS]
	})
}
