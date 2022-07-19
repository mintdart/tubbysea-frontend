import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'
import Borrow from './Borrow'
import Repay from './Repay'

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
			{type === 'borrow' ? <Borrow id={id} /> : <Repay id={id} />}
		</article>
	)
}
