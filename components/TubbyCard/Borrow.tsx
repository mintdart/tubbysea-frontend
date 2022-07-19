import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'

export default function Borrow({ id }: { id?: number }) {
	const price = id && 0.1091

	return (
		<span className={styles.infoWrapper}>
			<p className={styles.dullText}>{id && `#${id}`}</p>
			<span className={styles.quoteSection}>
				<p>Quote</p>
				<span className={styles.flexRow}>
					<p className={styles.flexRowSm}>
						<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
						<span data-animate={price ? true : false} className={styles.price}>
							{price}
						</span>
					</p>
					<button className={styles.actionButton}>Borrow ETH</button>
				</span>
			</span>
		</span>
	)
}
