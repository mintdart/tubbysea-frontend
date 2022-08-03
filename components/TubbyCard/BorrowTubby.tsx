import * as React from 'react'
import Image from 'next/image'
import { useGetQuote } from '~/hooks/useQuotation'
import { useGetCartItems, useSaveItemToCart } from '~/hooks/useCart'
import styles from './TubbyCard.module.css'

interface IBorrowTubby {
	tokenId: number
	imgUrl: string
}

// TODO: handle queries error
export function BorrowTubby({ tokenId, imgUrl }: IBorrowTubby) {
	const { data: quote, isLoading: isFetchingQuote } = useGetQuote()
	const { data: cartItems } = useGetCartItems()
	const { mutate } = useSaveItemToCart()

	const storeItem = () => {
		if (!tokenId) return

		mutate({ tokenId })
	}

	return (
		<article className={styles.card}>
			{/* {fetchingImg ? (
				<span
					className="placeholder-container"
					style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px 12px 0 0' }}
				></span>
			) : (
				<span className={styles.imageWrapper}>
					{imgURL && (
						<Image
							src={imgURL ? `https://cloudflare-ipfs.com/${imgURL}` : '/tubbycats.png'}
							alt={`token id ${id}`}
							layout="fill"
						/>
					)}
				</span>
			)} */}
			<span className={styles.imageWrapper}>
				{imgUrl && <Image src={imgUrl || '/tubbycats.png'} alt={`token id ${tokenId}`} layout="fill" />}
			</span>
			<span className={styles.infoWrapper}>
				<p className={styles.dullText}>{(tokenId || tokenId === 0) && `#${tokenId}`}</p>
				<span className={styles.quoteSection}>
					<p>Quote</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span data-animate={isFetchingQuote ? true : false} className={styles.price}>
								{quote?.price ?? (!isFetchingQuote && '-')}
							</span>
						</p>
						{cartItems?.find((item) => item.tokenId === tokenId) ? (
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
							<button
								className={styles.actionButton}
								onClick={storeItem}
								disabled={!tokenId || !quote || !quote.signature}
							>
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
			<span className="placeholder-container" style={{ width: '100%', aspectRatio: '1/1' }}></span>
			<span className={styles.infoWrapper}>
				<p className={styles.dullText}>{}</p>
				<span className={styles.quoteSection}>
					<p>Quote</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span className="placeholder-container" style={{ width: '6ch', height: '16px' }}></span>
						</p>

						<button className={styles.actionButton} disabled>
							Borrow ETH
						</button>
					</span>
				</span>
			</span>
		</article>
	)
}
