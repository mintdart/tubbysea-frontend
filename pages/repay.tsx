import type { NextPage } from 'next'
import Layout from '~/components/Layout'
import { RepayTubby, RepayTubbyPlaceholder } from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'
import { useGetLoans } from '~/hooks/useLoans'

const Repay: NextPage = () => {
	const { data: tubbies, isLoading, isError } = useGetLoans()

	return (
		<Layout>
			{isError ? (
				<p className="fallback-text">Sorry, couldn't get nfts for your address</p>
			) : isLoading ? (
				<TubbyGrid>
					{new Array(8).fill('tubby').map((_, index) => (
						<RepayTubbyPlaceholder key={index} />
					))}
				</TubbyGrid>
			) : tubbies.length === 0 ? (
				<p className="fallback-text">You do not have any active loans</p>
			) : (
				<TubbyGrid>
					{tubbies.map((id) => (
						<RepayTubby key={id} id={id} />
					))}
				</TubbyGrid>
			)}
		</Layout>
	)
}

export default Repay
