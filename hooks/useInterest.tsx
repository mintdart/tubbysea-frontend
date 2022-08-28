import BigNumber from 'bignumber.js'
import { useContractRead, useNetwork } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import { useGetCartItems } from './useCart'
import { useGetQuote } from './useQuotation'

export function useGetInterest() {
	const { chain } = useNetwork()

	const contracts = chain?.unsupported ? chainConfig[1] : chainConfig[chain?.id ?? 1]

	const { data: cartItems } = useGetCartItems()
	const { data: quote } = useGetQuote()

	const totalPrice = cartItems && quote?.price && cartItems?.length * quote?.price

	// get current annual interest of all items in cart
	const query = useContractRead({
		addressOrName: contracts.lendingAddress,
		contractInterface: contracts.lendingABI,
		functionName: 'currentAnnualInterest',
		args: new BigNumber(totalPrice || 0).multipliedBy(1e18).toFixed(0),
		select: (data: any) => transformData(data)
	})

	return query
}

const transformData = (data: BigNumber): any => {
	return data ? (Number(data.toString()) / 1e16)?.toFixed(2) : null
}
