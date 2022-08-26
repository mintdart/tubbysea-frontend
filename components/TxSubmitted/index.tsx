import * as React from 'react'
import { DisclosureState } from 'ariakit'
import { Dialog } from 'ariakit/dialog'
import { useNetwork } from 'wagmi'
import styles from './index.module.css'
import dialogStyles from '~/styles/dialog.module.css'

interface FormDialogProps {
	dialog: DisclosureState
	transactionHash: React.RefObject<string>
}

export default function TxSubmittedDialog({ dialog, transactionHash }: FormDialogProps) {
	const { chain } = useNetwork()

	const blockExplorerUrl = chain?.blockExplorers?.default.url ?? 'https://etherscan.io'

	return (
		<Dialog state={dialog} className={dialogStyles.dialog}>
			<header className={dialogStyles.dialogHeaderEnd}>
				<button className="buttonDismiss" onClick={dialog.toggle}>
					<span className="visually-hidden">Close</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={24} height={24}>
						<path
							fillRule="evenodd"
							d="M3.97 3.97a.75.75 0 011.06 0L12 10.94l6.97-6.97a.75.75 0 111.06 1.06L13.06 12l6.97 6.97a.75.75 0 11-1.06 1.06L12 13.06l-6.97 6.97a.75.75 0 01-1.06-1.06L10.94 12 3.97 5.03a.75.75 0 010-1.06z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</header>
			<div className={styles.checkIconWrapper}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="80"
					height="80"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<polyline points="16 12 12 8 8 12"></polyline>
					<line x1="12" y1="16" x2="12" y2="8"></line>
				</svg>
			</div>
			<h1 className={styles.submitted}>Transaction Submitted</h1>
			<a
				href={blockExplorerUrl + '/tx/' + transactionHash.current}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.explorerLink}
			>
				View on Etherscan
			</a>
			<button onClick={dialog.toggle} className={styles.checkoutButton}>
				Close
			</button>
		</Dialog>
	)
}
