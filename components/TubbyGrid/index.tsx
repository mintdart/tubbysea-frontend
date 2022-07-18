import * as React from 'react'
import styles from './TubbyGrid.module.css'

interface ITubbyGrid {
	children: React.ReactNode
}

export default function TubbyGrid({ children }: ITubbyGrid) {
	return <div className={styles.wrapper}>{children}</div>
}
