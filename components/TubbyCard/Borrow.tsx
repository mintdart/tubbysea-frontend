import * as React from 'react'
import Image from 'next/image'
import { useQuote } from '~/hooks/usePrice'
import styles from './TubbyCard.module.css'

export default function Borrow({ id }: { id?: number }) {
	const { data, isLoading } = useQuote()

	return (
		<span className={styles.infoWrapper}>
			<p className={styles.dullText}>{id && `#${id}`}</p>
			<span className={styles.quoteSection}>
				<p>Quote</p>
				<span className={styles.flexRow}>
					<p className={styles.flexRowSm}>
						<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
						<span data-animate={isLoading ? true : false} className={styles.price}>
							{data?.price ?? '-'}
						</span>
					</p>
					<button className={styles.actionButton} disabled={!data || !data.signature}>
						Borrow ETH
					</button>
				</span>
			</span>
		</span>
	)
}
