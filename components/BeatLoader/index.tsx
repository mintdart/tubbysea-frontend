import React from 'react'
import styles from './BeatLoader.module.css'

export default function BeatLoader({ ...props }) {
	return (
		<span className={styles.wrapper} {...props}>
			<span className={styles.circle}></span>
			<span className={`${styles.circle} ${styles.center}`}></span>
			<span className={styles.circle}></span>
		</span>
	)
}
