import type { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import { useDialogState } from 'ariakit'
import Layout from '~/components/Layout'
import TubbyGrid from '~/components/TubbyGrid'
import { RepayTubby, RepayTubbyPlaceholder } from '~/components/TubbyCard'
import TxSubmittedDialog from '~/components/TxSubmitted'
import { useGetLoans } from '~/hooks/useLoans'

const Repay: NextPage = () => {
	const { data: tubbies = [], isLoading, error } = useGetLoans()

	const transactionDialog = useDialogState()
	const transactionHash = React.useRef<string | null>(null)

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
					<p className="fallback-text">There are no active loans in this address.</p>
				) : (
					<TubbyGrid>
						{tubbies.map((tubby) => (
							<RepayTubby
								key={tubby.nft}
								details={tubby}
								txDialog={transactionDialog}
								transactionHash={transactionHash}
							/>
						))}
					</TubbyGrid>
				)}
			</Layout>
			<TxSubmittedDialog dialog={transactionDialog} transactionHash={transactionHash} />
		</>
	)
}

const Placeholder = () => {
	return (
		<TubbyGrid>
			{new Array(10).fill('tubby').map((_, index) => (
				<RepayTubbyPlaceholder key={index} />
			))}
		</TubbyGrid>
	)
}

export default Repay
