import * as React from 'react'
import Image from 'next/image'
import { DisclosureState } from 'ariakit'
import { useQuote } from '~/hooks/usePrice'
import { useSaveItemToBorrow } from '~/hooks/useSaveItemToBorrow'
import styles from './TubbyCard.module.css'
import { NFT_TESTNET_CONTRACT } from '~/lib/contracts'

interface IBorrow {
	id?: number
	dialog: DisclosureState
}

export default function Borrow({ id, dialog }: IBorrow) {
	const [click, setClick] = React.useState(false)
	const { data, isLoading } = useQuote()

	const { mutate } = useSaveItemToBorrow()

	const storeItem = () => {
		if (!id) return

		setClick(!click)

		mutate({ contract: NFT_TESTNET_CONTRACT, tokenId: id })
	}

	return (
		<span className={styles.infoWrapper}>
			<p className={styles.dullText}>{id && `#${id}`}</p>
			<span className={styles.quoteSection}>
				<p>Quote</p>
				<span className={styles.flexRow}>
					<p className={styles.flexRowSm}>
						<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
						<span data-animate={isLoading ? true : false} className={styles.price}>
							{data?.price ?? (!isLoading && '-')}
						</span>
					</p>
					{click ? (
						<button className={styles.savedButton} onClick={storeItem}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={styles.checkMark}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>Added to cart</span>
						</button>
					) : (
						<button className={styles.actionButton} onClick={storeItem} disabled={!id || !data || !data.signature}>
							Borrow ETH
						</button>
					)}
				</span>
			</span>
		</span>
	)
}
