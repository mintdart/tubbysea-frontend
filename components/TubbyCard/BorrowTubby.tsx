import * as React from 'react'
import Image from 'next/image'
import { useGetQuote } from '~/hooks/useGetQuote'
import { useGetCartItems, useSaveItemToCart } from '~/hooks/useCart'
import styles from './TubbyCard.module.css'

interface IBorrowTubby {
	id: number
}

const imgUrl = '/minty.jpeg'

// TODO: handle queries error

export function BorrowTubby({ id }: IBorrowTubby) {
	const { data: quote, isLoading: isFetchingQuote } = useGetQuote()
	const { data: cartItems } = useGetCartItems()
	const { mutate } = useSaveItemToCart()

	const storeItem = () => {
		if (!id) return

		mutate({ tokenId: id })
	}

	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}>
				{imgUrl && <Image src={imgUrl} alt={`token id ${id}`} layout="fill" />}
			</span>
			<span className={styles.infoWrapper}>
				<p className={styles.dullText}>{id && `#${id}`}</p>
				<span className={styles.quoteSection}>
					<p>Quote</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span data-animate={isFetchingQuote ? true : false} className={styles.price}>
								{quote?.price ?? (!isFetchingQuote && '-')}
							</span>
						</p>
						{cartItems?.includes(id) ? (
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
							<button className={styles.actionButton} onClick={storeItem} disabled={!id || !quote || !quote.signature}>
								Borrow ETH
							</button>
						)}
					</span>
				</span>
			</span>
		</article>
	)
}

export const BorrowTubbyPlaceholder = () => {
	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}></span>
			<span className={styles.infoWrapper}>
				<p className={styles.dullText}>{}</p>
				<span className={styles.quoteSection}>
					<p>Quote</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span data-animate={true} className={styles.price}></span>
						</p>

						<button className={styles.actionButton} disabled={true}>
							Borrow ETH
						</button>
					</span>
				</span>
			</span>
		</article>
	)
}