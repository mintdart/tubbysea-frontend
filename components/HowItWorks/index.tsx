import styles from './HowItWorks.module.css'

export default function HowItWorks() {
	return (
		<article className={styles.wrapper}>
			<h1 className={styles.header}>TUBBY SEA</h1>
			<ul>
				<li>Deposit tubbies as collateral and borrow ethereum</li>
				<li>All loans last for 2 weeks max and there are no liquidations</li>
				<li>Only pay for the time you borrow</li>
				<li>Interest is based on pool utilization and capped at 80%</li>
			</ul>
		</article>
	)
}
