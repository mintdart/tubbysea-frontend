import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS } from '~/lib/contracts'

export function useSetContractApproval() {
	const contractWrite = useContractWrite({
		addressOrName: LENDING_POOL_ADDRESS,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'setApprovalForAll',
		args: [LENDING_POOL_ADDRESS, false]
		// overrides: { gasLimit: new BigNumber(0.0005).times(1e9).toString() }
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
		args: [address, LENDING_POOL_ADDRESS]
	})
}
