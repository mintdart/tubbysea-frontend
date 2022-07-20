import type { NextPage } from 'next'
import { useAccount, useContractRead } from 'wagmi'
import { Dialog, DialogDismiss, DialogHeading, useDialogState } from 'ariakit/dialog'
import BigNumber from 'bignumber.js'
import Layout from '~/components/Layout'
import TubbyCard, { TubbyPlaceholder } from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'
import { NFTS_LIST_ABI, NFTS_LIST_CONTRACT, NFT_TESTNET_CONTRACT } from '~/lib/contracts'

const Home: NextPage = () => {
	const { address } = useAccount()
	const { data, isError, isLoading } = useContractRead({
		addressOrName: NFTS_LIST_CONTRACT,
		contractInterface: NFTS_LIST_ABI,
		functionName: 'getOwnedNfts',
		args: [address, NFT_TESTNET_CONTRACT, 1625000, 1626000]
	})

	const tubbies: number[] = data
		? data[0]
				.map((item: BigNumber) => Number(item.toString()))
				.filter((item: number) => item !== 0 && !Number.isNaN(item))
		: []

	const dialog = useDialogState()

	return (
		<Layout>
			{isError ? (
				<p className="fallback-text">Sorry, couldn't get nfts for your address</p>
			) : isLoading ? (
				<TubbyGrid>
					{new Array(8).fill('tubby').map((_, index) => (
						<TubbyPlaceholder key={index} type="borrow" />
					))}
				</TubbyGrid>
			) : (
				<TubbyGrid>
					{tubbies.map((id) => (
						<TubbyCard key={id} id={id} type="borrow" dialog={dialog} />
					))}
				</TubbyGrid>
			)}
			<Dialog state={dialog} className="dialog">
				<header className="header">
					<DialogHeading className="heading">Checkout</DialogHeading>
					<DialogDismiss className="button dismiss" />
				</header>
				<ul>
					<li>
						<strong>Calories:</strong> 95
					</li>
				</ul>
			</Dialog>
		</Layout>
	)
}

export default Home
