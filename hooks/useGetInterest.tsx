import BigNumber from 'bignumber.js'
import { useContractRead } from 'wagmi'
import { LENDING_POOL_ABI, LENDING_POOL_CONTRACT } from '~/lib/contracts'
import { useGetCartItems } from './useCart'
import { useGetQuote } from './useGetQuote'

export function useGetInterest() {
	const { data: cartItems } = useGetCartItems()
	const { data: quote } = useGetQuote()

	const totalPrice = cartItems && quote?.price && cartItems?.length * quote?.price

	// get current annual interest of all items in cart
	const query = useContractRead({
		addressOrName: LENDING_POOL_CONTRACT,
		contractInterface: LENDING_POOL_ABI,
		functionName: 'currentAnnualInterest',
		args: new BigNumber(totalPrice || 0).multipliedBy(1e18).toString(),
		select: (data: any) => transformData(data)
	})

	return query
}

const transformData = (data: BigNumber): any => {
	return data && Number(data.toString())
}
