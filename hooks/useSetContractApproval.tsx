import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_CONTRACT } from '~/lib/contracts'

export function useSetContractApproval() {
	const { address } = useAccount()

	const contractWrite = useContractWrite({
		addressOrName: LENDING_POOL_CONTRACT,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'setApprovalForAll',
		args: [address, true]
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash
	})

	return { ...contractWrite, waitForTransaction }
}
