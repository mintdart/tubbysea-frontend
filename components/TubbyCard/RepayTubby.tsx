import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'
import { ILoan } from '~/hooks/useGetLoans'

const imgUrl = '/minty.jpeg'

export function RepayTubby({ details }: { details: ILoan }) {
	const price = 0

	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}>
				{imgUrl && <Image src={imgUrl} alt={`loan id ${details.loanId}`} layout="fill" />}
			</span>
			<span className={styles.infoWrapper}>
				<span className={styles.flexRow}>
					<p className={styles.dullText}>{(details.nft || details.nft === 0) && `#${details.nft}`}</p>
					<p className={`${styles.flexRowSm} ${styles.dullText}`}>
						<span className="visually-hidden">Time left to repay loan</span>
						<svg
							stroke="currentColor"
							fill="none"
							strokeWidth="2"
							viewBox="0 0 24 24"
							strokeLinecap="round"
							strokeLinejoin="round"
							height="14px"
							width="14px"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<polyline points="12 6 12 12 16 14"></polyline>
						</svg>
						<span>25 days left</span>
					</p>
				</span>
				<span className={styles.quoteSection}>
					<p>To Pay</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span className={styles.price}>{details.nft}</span>
						</p>
						<button className={styles.actionButton}>Repay ETH</button>
					</span>
				</span>
			</span>
		</article>
	)
}

export function RepayTubbyPlaceholder() {
	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}></span>
			<span className={styles.infoWrapper}>
				<span className={styles.flexRow}>
					<p className={styles.dullText}></p>
					<p className={`${styles.flexRowSm} ${styles.dullText}`}>
						<span className="visually-hidden">Time left to repay loan</span>
						<svg
							stroke="currentColor"
							fill="none"
							strokeWidth="2"
							viewBox="0 0 24 24"
							strokeLinecap="round"
							strokeLinejoin="round"
							height="14px"
							width="14px"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<polyline points="12 6 12 12 16 14"></polyline>
						</svg>
						<span>25 days left</span>
					</p>
				</span>
				<span className={styles.quoteSection}>
					<p>To Pay</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span data-animate={true} className={styles.price}></span>
						</p>
						<button className={styles.actionButton}>Repay ETH</button>
					</span>
				</span>
			</span>
		</article>
	)
}
