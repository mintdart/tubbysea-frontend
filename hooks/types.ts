import { ethers } from 'ethers'

export interface INftApiResponse {
	ownedNfts: {
		id: {
			tokenId: string
		}
		metadata: {
			image: string
		}
	}[]
}

export interface INftItem {
	tokenId: number
	imgUrl: string
}

export interface IError {
	message?: string
}

export type Provider = ethers.providers.BaseProvider

export interface ICart {
	[key: string]: Array<number>
}
