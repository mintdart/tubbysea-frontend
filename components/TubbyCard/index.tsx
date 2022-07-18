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
			<div className={styles.imageWrapper}>
				<Image src={imgUrl} alt={`tubby#${id}`} layout="fill" />
			</div>
			<div className={styles.infoWrapper}>
				<p className={styles.cardId}>{`#${id}`}</p>
				<div className={styles.actionsWrapper}>
					<p className={styles.price}>
						<span>0.1091</span>
						<Image src="/ethereum.png" height="14px" width="20px" objectFit="contain" alt="ethereum" />
					</p>
					{type === 'borrow' ? (
						<button className={styles.actionButton}>Borrow ETH</button>
					) : (
						<button className={styles.actionButton}>Repay</button>
					)}
				</div>
			</div>
		</article>
	)
}
