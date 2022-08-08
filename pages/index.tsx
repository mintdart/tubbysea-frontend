import type { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import Layout from '~/components/Layout'
import TubbyGrid from '~/components/TubbyGrid'
import { BorrowTubbyPlaceholder, BorrowTubby } from '~/components/TubbyCard'
import { MobileOnlyCart, DesktopOnlyCart } from '~/components/Cart'
import { useGetNftsList } from '~/hooks/useNftsList'
import { useGetLoans } from '~/hooks/useLoans'

const Home: NextPage = () => {
	// get number of nft's owned by user of a given contract
	const { data: tubbies, isError, isLoading: fetchingNftsList } = useGetNftsList('borrow')

	// prefetch
	useGetLoans()

	return (
		<>
			<Head>
				<title>borrow | tubby sea</title>
			</Head>

			<Layout>
				{isError ? (
					<p className="fallback-text">Sorry, couldn't get nfts for your address</p>
				) : fetchingNftsList ? (
					<Placeholder />
				) : tubbies.length === 0 ? (
					<p className="fallback-text">You do not have any tubby cats in your wallet</p>
				) : (
					<TubbyGrid>
						{tubbies?.map(({ tokenId, imgUrl }) => (
							<BorrowTubby key={tokenId} tokenId={tokenId} imgUrl={imgUrl} />
						))}
					</TubbyGrid>
				)}

				<DesktopOnlyCart />
			</Layout>

			<MobileOnlyCart />
		</>
	)
}

const Placeholder = () => {
	return (
		<TubbyGrid>
			{new Array(10).fill('tubby').map((_, index) => (
				<BorrowTubbyPlaceholder key={index} />
			))}
		</TubbyGrid>
	)
}

export default Home
