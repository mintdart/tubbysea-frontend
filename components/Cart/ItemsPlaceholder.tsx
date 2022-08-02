import Image from 'next/image'
import styles from './Cart.module.css'

export default function ItemsPlaceholder() {
	return (
		<ul className={styles.list}>
			{new Array(2).fill('tubby').map((_, index) => (
				<li key={'tubbyplaceholder' + index} className={styles.listItem}>
					<span className="placeholder-container" style={{ width: '40px', height: '40px' }}></span>
					<span className={styles.itemDetails}>
						<span className="placeholder-container" style={{ width: '8ch', height: '14px' }}></span>
						<span className={styles.collectionName}>tubby cats</span>
					</span>

					<span className={styles.priceWrapper}>
						<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
						<span className="placeholder-container" style={{ width: '4ch', height: '16px' }}></span>
					</span>
				</li>
			))}
		</ul>
	)
}
