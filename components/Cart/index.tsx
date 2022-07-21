import Link from 'next/link'
import Image from 'next/image'
import { DisclosureState } from 'ariakit'
import { Dialog, DialogDismiss, DialogHeading } from 'ariakit/dialog'
import { useGetCartItems } from '~/hooks/useCart'
import styles from './Cart.module.css'
import { useQuote } from '~/hooks/usePrice'

const imgUrl = '/minty.jpeg'

// TODO: handle loading and error states
export default function Cart({ dialog }: { dialog: DisclosureState }) {
	const { data: cartItems } = useGetCartItems()
	const { data: quote } = useQuote()

	return (
		<Dialog state={dialog} portal={typeof window !== 'undefined'} className={styles.dialog}>
			<header className={styles.dialogHeader}>
				<DialogHeading className={styles.dialogHeading}>Checkout</DialogHeading>
				<Link href="/">
					<DialogDismiss as="a" className={styles.dialogButtonDismiss} />
				</Link>
			</header>

			{cartItems && quote && cartItems?.length > 0 && quote?.price ? (
				<>
					<ul className={styles.list}>
						{cartItems?.map((item) => (
							<li key={item} className={styles.listItem}>
								<Image src={imgUrl} width="40px" height="40px" objectFit="cover" alt={`token id ${item}`} />
								<span className={styles.itemDetails}>
									<span>{`#${item}`}</span>
									<span className={styles.collectionName}>Tubby Cats</span>
								</span>

								<span className={styles.quotePrice}>
									<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
									<span>{quote?.price}</span>
								</span>
							</li>
						))}
					</ul>
					<hr />
					<ul className={styles.list}>
						<li className={styles.listItem}>
							<span>You Receive</span>
							<span className={styles.quotePrice}>
								<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
								<span>{cartItems?.length * quote?.price}</span>
							</span>
						</li>
						<li className={styles.listItem}>
							<span>Interest</span>
							<span className={styles.quotePrice}>
								<span>{cartItems?.length * quote?.price}</span>
							</span>
						</li>
						<li className={styles.listItem}>
							<span>Deadline</span>
							<span className={styles.quotePrice}>
								<span>{quote.deadline && new Date(quote.deadline * 1000)?.toLocaleString()}</span>
							</span>
						</li>
					</ul>
				</>
			) : (
				<></>
			)}
		</Dialog>
	)
}
