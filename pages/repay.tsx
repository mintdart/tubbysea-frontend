import type { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import Layout from '~/components/Layout'
import TubbyGrid from '~/components/TubbyGrid'
import { RepayTubby, RepayTubbyPlaceholder } from '~/components/TubbyCard'
import { useGetLoans } from '~/hooks/useLoans'

const Repay: NextPage = () => {
	const { data: tubbies = [], isLoading, error } = useGetLoans()

	return (
		<>
			<Head>
				<title>repay | tubby sea</title>
			</Head>

			<Layout>
				{error ? (
					<p className="fallback-text">{error.message ?? "Sorry, couldn't get loans of your address"}</p>
				) : isLoading ? (
					<Placeholder />
				) : tubbies.length === 0 ? (
					<p className="fallback-text">You do not have any active loans</p>
				) : (
					<React.Suspense fallback={<Placeholder />}>
						<TubbyGrid>
							{tubbies.map((tubby) => (
								<RepayTubby key={tubby.nft} details={tubby} />
							))}
						</TubbyGrid>
					</React.Suspense>
				)}
			</Layout>
		</>
	)
}

const Placeholder = () => {
	return (
		<TubbyGrid>
			{new Array(8).fill('tubby').map((_, index) => (
				<RepayTubbyPlaceholder key={index} />
			))}
		</TubbyGrid>
	)
}

export default Repay
