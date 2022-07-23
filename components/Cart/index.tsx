import Link from 'next/link'
import Image from 'next/image'
import { DisclosureState } from 'ariakit'
import { Dialog, DialogDismiss, DialogHeading } from 'ariakit/dialog'
import { useGetCartItems, useSaveItemToCart } from '~/hooks/useCart'
import { useGetQuote } from '~/hooks/useGetQuote'
import styles from './Cart.module.css'
import { useGetInterest } from '~/hooks/useGetInterest'

const imgUrl = '/minty.jpeg'

// TODO: handle loading and error states
export default function Cart({ dialog }: { dialog: DisclosureState }) {
	const { data: cartItems } = useGetCartItems()
	const { data: quote } = useGetQuote()
	const { data: currentAnnualInterest } = useGetInterest()
	const { mutate } = useSaveItemToCart()

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
								<button className={styles.removeButton} onClick={() => mutate({ tokenId: item })}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
									<span className="visually-hidden">Remove Item from cart</span>
								</button>
								<Image src={imgUrl} width="40px" height="40px" objectFit="cover" alt={`token id ${item}`} />
								<span className={styles.itemDetails}>
									<span>{`#${item}`}</span>
									<span className={styles.collectionName}>tubby cats</span>
								</span>

								<span className={styles.priceWrapper}>
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
							<span className={styles.priceWrapper}>
								<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
								<span>{cartItems?.length * quote?.price} ETH</span>
							</span>
						</li>
						<li className={styles.listItem}>
							<span>Interest</span>
							<span className={styles.priceWrapper}>
								<span>
									{currentAnnualInterest &&
										typeof currentAnnualInterest === 'number' &&
										`${(currentAnnualInterest / 1e18).toFixed(2)}% p.a.`}
								</span>
							</span>
						</li>
						<li className={styles.listItem}>
							<span>Deadline</span>
							<span className={styles.priceWrapper}>
								<span>{quote.deadline && new Date(quote.deadline * 1000)?.toLocaleString()}</span>
							</span>
						</li>
					</ul>
					<button className={styles.checkoutButton}>Approve</button>
				</>
			) : (
				<p className={styles.emptyMsg}>Your cart is empty. Fill it with NFTs to borrow ETH.</p>
			)}
		</Dialog>
	)
}
