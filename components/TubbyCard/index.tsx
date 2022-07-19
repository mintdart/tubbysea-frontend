import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'

interface ITubbyCardProps {
	imgUrl: string
	id: string
	type: 'borrow' | 'repay'
}

export default function TubbyCard({ imgUrl, id, type }: ITubbyCardProps) {
	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}>
				<Image src={imgUrl} alt={`tubby#${id}`} layout="fill" />
			</span>
			<span className={styles.infoWrapper}>
				<p className={styles.cardId}>{`#${id}`}</p>
				<span className={styles.actionsWrapper}>
					<p className={styles.priceWrapper}>
						<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
						<span>0.1091</span>
					</p>
					{type === 'borrow' ? (
						<button className={styles.actionButton}>Borrow ETH</button>
					) : (
						<button className={styles.actionButton}>Repay</button>
					)}
				</span>
			</span>
		</article>
	)
}
