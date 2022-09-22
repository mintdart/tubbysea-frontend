import * as React from 'react'
import Image from 'next/image'
import { ILoan } from '~/hooks/useLoans'
import { useSaveItemToCart } from '~/hooks/useCart'
import styles from './TubbyCard.module.css'

// in ms
const day = 24 * 60 * 60 * 1000
const hour = 60 * 60 * 1000
const minute = 60 * 1000
const second = 1000

const formatDate = (deadline: number) => {
	const timeLeft = deadline - Date.now()

	// max deadline - return expired
	if (timeLeft <= 0) {
		return 'Expired'
	} else if (timeLeft / day > 1) {
		return `${(timeLeft / day).toFixed(2)} days left`
	} else if (timeLeft / hour > 1) {
		return `${(timeLeft / hour).toFixed(2)} hours left`
	} else if (timeLeft / minute > 1) {
		return `${(timeLeft / minute).toFixed(2)} minutes left`
	} else if (timeLeft / second > 1) {
		return `${(timeLeft / second).toFixed(2)} seconds left`
	} else return null
}

export function RepayTubby({ details }: { details: ILoan }) {
	const { mutate } = useSaveItemToCart()

	const storeItem = () => {
		if (!details.loanId) return

		mutate({ tokenId: details.loanId, cartType: 'repay' })
	}

	return (
		<li className={styles.card}>
			<span className={styles.imageWrapper}>
				{<Image src={details.imgUrl || '/paw.png'} alt={`token id ${details.loanId}`} layout="fill" />}
			</span>

			<span className={styles.infoWrapper}>
				<span className={styles.flexRow}>
					<p className={styles.dullText}>{(details.nft || details.nft === 0) && `#${details.loanId}`}</p>
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
						<span>{formatDate(details.deadline)}</span>
					</p>
				</span>
				<span className={styles.quoteSection}>
					<p>To Pay</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span className={styles.price}>{(details.totalRepay / 1e18).toFixed(2)}</span>
						</p>
						<button className={styles.actionButton} onClick={storeItem}>
							Repay ETH
						</button>
					</span>
				</span>
			</span>
		</li>
	)
}

export function RepayTubbyPlaceholder() {
	return (
		<li className={styles.card}>
			<span
				className="placeholder-container"
				style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px 12px 0 0' }}
			></span>
			<span className={styles.infoWrapper}>
				<span className={styles.flexRow}>
					<span className="placeholder-container" style={{ width: '10ch', height: '16px' }}></span>
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
						<span className="placeholder-container" style={{ width: '10ch', height: '16px' }}></span>
					</p>
				</span>
				<span className={styles.quoteSection}>
					<p>To Pay</p>
					<span className={styles.flexRow}>
						<p className={styles.flexRowSm}>
							<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
							<span className="placeholder-container" style={{ width: '6ch', height: '16px' }}></span>
						</p>
						<button className={styles.actionButton} disabled>
							Repay ETH
						</button>
					</span>
				</span>
			</span>
		</li>
	)
}
