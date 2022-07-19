export const NFTS_LIST_ABI = [
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'contract IERC721', name: 'nftContract', type: 'address' },
			{ internalType: 'uint256', name: 'start', type: 'uint256' },
			{ internalType: 'uint256', name: 'end', type: 'uint256' }
		],
		name: 'getOwnedNfts',
		outputs: [
			{ internalType: 'uint256[100]', name: 'nfts', type: 'uint256[100]' },
			{ internalType: 'uint256', name: 'length', type: 'uint256' }
		],
		stateMutability: 'view',
		type: 'function'
	}
]
