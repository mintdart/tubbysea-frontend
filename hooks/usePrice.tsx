import { useQuery } from '@tanstack/react-query'
import { QUOTE_SERVER_API } from '~/lib/constants'

interface IQuoteResponse {
	deadline: number
	nftContract: string
	price: string
	signature: {
		r: string
		s: string
		v: number
	}
}

interface IQuoteError {
	message?: string
}

async function fetchQuote(): Promise<IQuoteResponse> {
	try {
		const res = await fetch(QUOTE_SERVER_API).then((res) => res.json())
		const price = Number(res.price)
		return { ...res, price: !Number.isNaN(price) ? price / 1e18 : null }
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't fetch quote"))
	}
}

const useQuote = () => {
	return useQuery<IQuoteResponse, IQuoteError>(['quote'], () => fetchQuote())
}

export { useQuote, fetchQuote }
