import {
	LENDING_POOL_ABI,
	LENDING_POOL_MAINNET_ADDRESS,
	LENDING_POOL_TESTNET_ADDRESS,
	NFT_TESTNET_ADDRESS,
	TUBBY_CATS_ADDRESS
} from './contracts'

export const QUOTE_SERVER_API = 'https://api.tubbysea.com/quote/tubby'

export const chainConfig: IChainConfig = {
	1: {
		ankrUrl: 'https://rpc.ankr.com/eth',
		alchemyUrl: 'https://eth-mainnet.g.alchemy.com/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		alchemyNftUrl: 'https://eth-mainnet.g.alchemy.com/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_/getNFTs',
		infuraUrl: 'https://mainnet.infura.io/v3/d24592b20f8b44a5a932dfb3c095d03a',
		collateralAddress: TUBBY_CATS_ADDRESS,
		lendingAddress: LENDING_POOL_MAINNET_ADDRESS,
		lendingABI: LENDING_POOL_ABI,
		ankrShortName: 'eth'
	},
	5: {
		ankrUrl: 'https://rpc.ankr.com/eth_goerli',
		alchemyUrl: 'https://eth-goerli.g.alchemy.com/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		alchemyNftUrl: 'https://eth-goerli.g.alchemy.com/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_/getNFTs',
		infuraUrl: 'https://goerli.infura.io/v3/d24592b20f8b44a5a932dfb3c095d03a',
		collateralAddress: NFT_TESTNET_ADDRESS,
		lendingAddress: LENDING_POOL_TESTNET_ADDRESS,
		lendingABI: LENDING_POOL_ABI,
		ankrShortName: 'eth_goerli'
	}
}

interface IChainConfig {
	[key: number]: {
		ankrUrl: string
		alchemyUrl: string
		alchemyNftUrl: string
		infuraUrl: string
		collateralAddress: string
		lendingAddress: string
		lendingABI: any
		ankrShortName: string
	}
}

export const LOCAL_STORAGE_KEY = 'tubbysea'
