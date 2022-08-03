import type { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useDialogState } from 'ariakit/dialog'
import Layout from '~/components/Layout'
import TubbyGrid from '~/components/TubbyGrid'
import { BorrowTubbyPlaceholder, BorrowTubby } from '~/components/TubbyCard'
import Cart from '~/components/Cart'
import { useGetNftsList } from '~/hooks/useNftsList'

const Home: NextPage = () => {
	const router = useRouter()
	const { cart } = router.query

	// get number of nft's owned by user of a given contract
	const { data: tubbies, isError, isLoading: fetchingNftsList } = useGetNftsList('borrow')

	const dialog = useDialogState({
		open: typeof cart === 'string' && cart === 'true',
		setOpen: (open) => {
			if (!open) {
				router.push('/')
			}
		}
	})

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
				) : (
					<React.Suspense fallback={<Placeholder />}>
						<TubbyGrid>
							{tubbies?.map(({ tokenId, imgUrl }) => (
								<BorrowTubby key={tokenId} tokenId={tokenId} imgUrl={imgUrl} />
							))}
						</TubbyGrid>
					</React.Suspense>
				)}
			</Layout>
			<Cart dialog={dialog} />
		</>
	)
}

const Placeholder = () => {
	return (
		<TubbyGrid>
			{new Array(8).fill('tubby').map((_, index) => (
				<BorrowTubbyPlaceholder key={index} />
			))}
		</TubbyGrid>
	)
}

export default Home
