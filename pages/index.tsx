import type { NextPage } from 'next'
import * as React from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { Dialog, DialogDismiss, DialogHeading, useDialogState } from 'ariakit/dialog'
import BigNumber from 'bignumber.js'
import Layout from '~/components/Layout'
import { BorrowTubbyPlaceholder, BorrowTubby } from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'
import { NFTS_LIST_ABI, NFTS_LIST_CONTRACT, NFT_TESTNET_CONTRACT } from '~/lib/contracts'
import styles from '~/styles/index.module.css'

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
	const isToggledBefore = React.useRef(false)

	return (
		<Layout>
			{isError ? (
				<p className="fallback-text">Sorry, couldn't get nfts for your address</p>
			) : isLoading ? (
				<TubbyGrid>
					{new Array(8).fill('tubby').map((_, index) => (
						<BorrowTubbyPlaceholder key={index} />
					))}
				</TubbyGrid>
			) : (
				<TubbyGrid>
					{tubbies.map((id) => (
						<BorrowTubby key={id} id={id} dialog={dialog} isToggledBefore={isToggledBefore} />
					))}
				</TubbyGrid>
			)}
			<Dialog state={dialog} className={styles.dialog}>
				<header className={styles.dialogHeader}>
					<DialogHeading className={styles.dialogHeading}>Checkout</DialogHeading>
					<DialogDismiss className={styles.dialogButtonDismiss} />
				</header>
				<ul>
					<li></li>
				</ul>
			</Dialog>
		</Layout>
	)
}

export default Home
