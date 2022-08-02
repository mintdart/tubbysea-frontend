import { DisclosureState } from 'ariakit'
import Wrapper from './CartDialogWrapper'
import styles from './Cart.module.css'

export default function NoWalletCart({ dialog }: { dialog: DisclosureState }) {
	return (
		<Wrapper dialog={dialog}>
			<p className={styles.emptyMsg}>Connect wallet to view items in cart.</p>
		</Wrapper>
	)
}
