import type { NextPage } from 'next'
import Head from 'next/head'
import * as React from 'react'
import { useDialogState } from 'ariakit/dialog'
import Layout from '~/components/Layout'
import { BorrowTubbyPlaceholder, BorrowTubby } from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'
import { useRouter } from 'next/router'
import Cart from '~/components/Cart'
import { useGetNfts } from '~/hooks/useGetNfts'

const Home: NextPage = () => {
	const router = useRouter()
	const { cart } = router.query

	// get number of nft's owned by user of a given contract
	const { data: tubbies, isError, isLoading: fetchingNftsList } = useGetNfts()

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
				<title>pawn your tubby cats!</title>
			</Head>

			<Layout>
				{isError ? (
					<p className="fallback-text">Sorry, couldn't get nfts for your address</p>
				) : fetchingNftsList ? (
					<Placeholder />
				) : (
					<React.Suspense fallback={<Placeholder />}>
						<TubbyGrid>
							{tubbies?.map((id) => (
								<BorrowTubby key={id} id={id} />
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
