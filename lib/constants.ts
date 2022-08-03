import { NFT_TESTNET_ADDRESS, TUBBY_CATS_ADDRESS } from './contracts'

export const QUOTE_SERVER_API = 'https://api.tubbysea.com/quote/tubby'

export const chainConfig: IChainConfig = {
	1: {
		ankrUrl: 'https://rpc.ankr.com/eth',
		alchemyUrl: 'https://eth-mainnet.g.alchemy.com/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		alchemyNftUrl: 'https://eth-mainnet.alchemyapi.io/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_/getNFTs/',
		infuraUrl: 'https://mainnet.infura.io/v3/d24592b20f8b44a5a932dfb3c095d03a',
		nftContractAddress: TUBBY_CATS_ADDRESS,
		ankrShortName: 'eth'
	},
	5: {
		ankrUrl: 'https://rpc.ankr.com/eth_goerli',
		alchemyUrl: 'https://eth-goerli.g.alchemy.com/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_',
		alchemyNftUrl: 'https://eth-goerli.alchemyapi.io/nft/v2/5uLJQgmJyFsgKvbnnnZHuPLGtgzdSSF_/getNFTs/',
		infuraUrl: 'https://goerli.infura.io/v3/d24592b20f8b44a5a932dfb3c095d03a',
		nftContractAddress: NFT_TESTNET_ADDRESS,
		ankrShortName: 'eth_goerli'
	}
}

interface IChainConfig {
	[key: number]: {
		ankrUrl: string
		alchemyUrl: string
		alchemyNftUrl: string
		infuraUrl: string
		nftContractAddress: string
		ankrShortName: string
	}
}
