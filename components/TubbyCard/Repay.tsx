import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'

export default function Repay({ id }: { id: string }) {
	return (
		<span className={styles.infoWrapper}>
			<span className={styles.flexRow}>
				<p className={styles.dullText}>{`#${id}`}</p>
				<div className={`${styles.flexRowSm} ${styles.dullText}`}>
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
					<p>25 days left</p>
				</div>
			</span>
			<span className={styles.quoteSection}>
				<p>To Pay</p>
				<span className={styles.flexRow}>
					<p className={styles.flexRowSm}>
						<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
						<span>0.1091</span>
					</p>
					<button className={styles.actionButton}>Repay ETH</button>
				</span>
			</span>
		</span>
	)
}
