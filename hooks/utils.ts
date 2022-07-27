import BigNumber from 'bignumber.js'

export const formatNftsListResponse = (data: [BigNumber[], BigNumber]) => {
	return data ? data[0].slice(0, Number(data[1].toString())).map((item: BigNumber) => Number(item.toString())) : []
}
