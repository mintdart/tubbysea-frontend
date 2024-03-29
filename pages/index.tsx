import type { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import { useDialogState } from 'ariakit'
import Layout from '~/components/Layout'
import TubbyGrid from '~/components/TubbyGrid'
import { BorrowTubbyPlaceholder, BorrowTubby } from '~/components/TubbyCard'
import { MobileOnlyCart, DesktopOnlyCart } from '~/components/Cart'
import TxSubmittedDialog from '~/components/TxSubmitted'
import { useGetNftsList } from '~/hooks/useNftsList'

const Home: NextPage = () => {
	// get number of nft's owned by user of a given contract
	const { data: tubbies, isError, isLoading: fetchingNftsList } = useGetNftsList('borrow')

	const transactionDialog = useDialogState()
	const transactionHash = React.useRef<string | null>(null)

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
					<p className="fallback-text">There are no tubby cats in this address.</p>
				) : (
					<TubbyGrid>
						{tubbies?.map(({ tokenId, imgUrl }) => (
							<BorrowTubby key={tokenId} tokenId={tokenId} imgUrl={imgUrl} />
						))}
					</TubbyGrid>
				)}

				<DesktopOnlyCart txDialog={transactionDialog} transactionHash={transactionHash} />
			</Layout>

			<MobileOnlyCart txDialog={transactionDialog} transactionHash={transactionHash} />
			<TxSubmittedDialog dialog={transactionDialog} transactionHash={transactionHash} />
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
