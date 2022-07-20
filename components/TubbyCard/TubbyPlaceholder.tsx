import * as React from 'react'
import styles from './TubbyCard.module.css'
import { BorrowPlaceholder } from './Borrow'
import Repay from './Repay'

interface ITubbyPlaceholderProps {
	type: 'borrow' | 'repay'
}

export function TubbyPlaceholder({ type }: ITubbyPlaceholderProps) {
	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}></span>
			{type === 'borrow' ? <BorrowPlaceholder /> : <Repay />}
		</article>
	)
}
