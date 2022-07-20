import * as React from 'react'
import Image from 'next/image'
import styles from './TubbyCard.module.css'
import Borrow from './Borrow'
import Repay from './Repay'
import { DisclosureState } from 'ariakit'

interface ITubbyCardProps {
	id: number
	type: 'borrow' | 'repay'
	dialog: DisclosureState
	isToggledBefore: React.MutableRefObject<boolean>
}

const imgUrl = '/minty.jpeg'

export default function TubbyCard({ id, type, dialog, isToggledBefore }: ITubbyCardProps) {
	return (
		<article className={styles.card}>
			<span className={styles.imageWrapper}>
				{imgUrl && <Image src={imgUrl} alt={`token id ${id}`} layout="fill" />}
			</span>
			{type === 'borrow' ? <Borrow id={id} dialog={dialog} isToggledBefore={isToggledBefore} /> : <Repay id={id} />}
		</article>
	)
}

export { TubbyPlaceholder } from './TubbyPlaceholder'
