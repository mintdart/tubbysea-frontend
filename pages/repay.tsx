import type { NextPage } from 'next'
import Layout from '~/components/Layout'
import { RepayTubby, RepayTubbyPlaceholder } from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'
import { useGetLoans } from '~/hooks/useGetLoans'

const Repay: NextPage = () => {
	const { data: tubbies = [], isLoading, error } = useGetLoans()

	return (
		<Layout>
			{error ? (
				<p className="fallback-text">{error.message ?? "Sorry, couldn't get loans of your address"}</p>
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
					{tubbies.map((tubby) => (
						<RepayTubby key={tubby.nft} details={tubby} />
					))}
				</TubbyGrid>
			)}
		</Layout>
	)
}

export default Repay
