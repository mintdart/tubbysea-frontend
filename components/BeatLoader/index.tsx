import styles from './BeatLoader.module.css'

export default function BeatLoader() {
	return (
		<span className={styles.wrapper}>
			<span className={styles.circle}></span>
			<span className={`${styles.circle} ${styles.center}`}></span>
			<span className={styles.circle}></span>
		</span>
	)
}
