import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'
import Borrow from './Borrow'
import Repay from './Repay'

interface ITubbyCardProps {
	id: number
	type: 'borrow' | 'repay'
}

const imgUrl = '/minty.jpeg'

export default function TubbyCard({ id, type }: ITubbyCardProps) {
	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}>
				{imgUrl && <Image src={imgUrl} alt={`token id ${id}`} layout="fill" />}
			</span>
			{type === 'borrow' ? <Borrow id={id} /> : <Repay id={id} />}
		</article>
	)
}

export { TubbyPlaceholder } from './TubbyPlaceholder'
