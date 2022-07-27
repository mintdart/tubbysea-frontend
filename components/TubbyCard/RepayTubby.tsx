import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'
import { ILoan } from '~/hooks/useGetLoans'

const imgUrl = '/minty.jpeg'

const day = 24 * 60 * 60 * 1000
const hour = 60 * 60 * 1000
const minute = 60 * 1000
const second = 1000

const formatDate = (startTime: number, maxTime: number) => {
	const timeElapsed = Date.now() - startTime
	const timeLeft = maxTime - timeElapsed

	// max deadline - return expired
	if (timeLeft <= 0) {
		return 'Expired'
	} else if (Math.ceil(timeLeft / day) > 1) {
		return `${Math.ceil(timeLeft / day)} days left`
	} else if (Math.ceil(timeLeft / hour) > 1) {
		return `${Math.ceil(timeLeft / hour)} hours left`
	} else if (Math.ceil(timeLeft / minute) > 1) {
		return `${Math.ceil(timeLeft / minute)} minutes left`
	} else if (Math.ceil(timeLeft / second) > 1) {
		return `${Math.ceil(timeLeft / second)} seconds left`
	} else return `${timeLeft} ms left`
}

export function RepayTubby({ details }: { details: ILoan }) {
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
						<span>{formatDate(details.startTime, details.maxLoanLength)}</span>
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
		</article>
	)
}
