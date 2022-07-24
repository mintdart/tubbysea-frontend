import Link from 'next/link'
import Image from 'next/image'
import { DisclosureState } from 'ariakit'
import { Dialog, DialogHeading } from 'ariakit/dialog'
import { useGetCartItems, useSaveItemToCart } from '~/hooks/useCart'
import { useGetQuote } from '~/hooks/useGetQuote'
import { useGetInterest } from '~/hooks/useGetInterest'
import { useSetContractApproval } from '~/hooks/useSetContractApproval'
import styles from './Cart.module.css'
import BeatLoader from '../BeatLoader'

const imgUrl = '/minty.jpeg'

// TODO: handle loading and error states
export default function Cart({ dialog }: { dialog: DisclosureState }) {
	const { data: cartItems } = useGetCartItems()
	const { data: quote } = useGetQuote()
	const { data: currentAnnualInterest } = useGetInterest()
	const { mutate: saveItemToCart } = useSaveItemToCart()
	const {
		write: approveContract,
		isLoading: approvingContract,
		isSuccess: approvedSuccessfully,
		error,
		waitForTransaction: { isSuccess: txSuccess, isLoading, error: txErrorOnChain }
	} = useSetContractApproval()

	return (
		<Dialog state={dialog} portal={typeof window !== 'undefined'} className={styles.dialog}>
			<header className={styles.dialogHeader}>
				<DialogHeading className={styles.dialogHeading}>Checkout</DialogHeading>
				<Link href="/">
					<a className={styles.dialogButtonDismiss}>
						<svg
							aria-hidden="true"
							fill="none"
							height="10"
							viewBox="0 0 10 10"
							width="10"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
								fill="currentColor"
							></path>
						</svg>
					</a>
				</Link>
			</header>

			{cartItems && quote && cartItems?.length > 0 && quote?.price ? (
				<>
					<ul className={styles.list}>
						{cartItems?.map((item) => (
							<li key={item} className={styles.listItem}>
								<button className={styles.removeButton} onClick={() => saveItemToCart({ tokenId: item })}>
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
					{(error || txErrorOnChain) && <p className={styles.errorMsg}>{error?.message ?? txErrorOnChain?.message}</p>}
					<button className={styles.checkoutButton} onClick={() => approveContract()}>
						{approvingContract || isLoading ? <BeatLoader /> : 'Approve'}
					</button>
				</>
			) : (
				<p className={styles.emptyMsg}>Your cart is empty. Fill it with NFTs to borrow ETH.</p>
			)}
		</Dialog>
	)
}
