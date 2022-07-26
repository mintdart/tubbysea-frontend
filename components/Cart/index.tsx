import Link from 'next/link'
import Image from 'next/image'
import { DisclosureState } from 'ariakit'
import { Dialog, DialogHeading } from 'ariakit/dialog'
import BeatLoader from '~/components/BeatLoader'
import { useGetCartItems, useSaveItemToCart } from '~/hooks/useCart'
import { useGetQuote } from '~/hooks/useGetQuote'
import { useGetInterest } from '~/hooks/useGetInterest'
import { useGetContractApproval, useSetContractApproval } from '~/hooks/useContractApproval'
import styles from './Cart.module.css'
import { CartItemsPlaceholder } from './Placeholder'

const imgUrl = '/minty.jpeg'

const formatErrorMsg = (error: any) => {
	if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
		return 'Cannot estimate gas, Transaction may fail or may require manual gas limit.'
	} else return error.reason
}

export default function Cart({ dialog }: { dialog: DisclosureState }) {
	// query to get cart items from local storage
	const { data: cartItems, isLoading: fetchingCartItems, isError: errorLoadingCartItems } = useGetCartItems()

	// query to get quotation from server
	const { data: quote, isLoading: fetchingQuote, isError: errorFetchingQuote } = useGetQuote()

	// query to get interest rates
	const { data: currentAnnualInterest, isLoading: fetchingInterest, isError: errorFetchingInterest } = useGetInterest()

	// query to save/remove item to cart/localstorage
	const { mutate: saveItemToCart } = useSaveItemToCart()

	// query to set approval for all tokens
	const {
		write: approveContract,
		isLoading: approvingContract,
		isSuccess: approvedSuccessfully,
		error: errorApproving,
		waitForTransaction: { isSuccess: txApproveSuccess, isLoading: checkingIfApproved, error: txApproveErrorOnChain }
	} = useSetContractApproval()

	// query to check approval of all tokens
	const { data, isLoading: fetchingIfApproved, error: failedToFetchIfApproved } = useGetContractApproval()

	// construct error messages
	const errorMsgOfQueries = errorLoadingCartItems
		? "Couldn't fetch items in your cart"
		: errorFetchingQuote
		? "Couldn't fetch price quotation"
		: errorFetchingInterest
		? "Couldn't fetch interest rate"
		: null

	const errorMsgOfEthersQueries = failedToFetchIfApproved
		? failedToFetchIfApproved?.message
		: errorApproving
		? formatErrorMsg(errorApproving)
		: txApproveErrorOnChain
		? txApproveErrorOnChain?.message
		: null

	// check all loading states to show beat loader
	const isLoading =
		fetchingCartItems ||
		fetchingQuote ||
		fetchingInterest ||
		approvingContract ||
		checkingIfApproved ||
		fetchingIfApproved

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

			{errorMsgOfQueries ? (
				<p className={styles.errorMsg}>{errorMsgOfQueries}</p>
			) : cartItems && cartItems.length <= 0 ? (
				<p className={styles.emptyMsg}>Your cart is empty. Fill it with NFTs to borrow ETH.</p>
			) : (
				<>
					{/* Show placeholder when fetching items in cart */}
					{fetchingCartItems ? (
						<CartItemsPlaceholder />
					) : (
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
					)}

					<hr />

					{/* These values are always truth as error and loading states are handles, but adding a check satisfy typescript compiler  */}
					{cartItems && quote && cartItems?.length > 0 && quote?.price && (
						<ul className={styles.list}>
							<li className={styles.listItem}>
								<span>You Receive</span>
								<span className={styles.priceWrapper}>
									<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
									{/* Show placeholder when fetching quotation */}
									{fetchingQuote ? (
										<span className="placeholder-container" style={{ width: '4ch', height: '16px' }}></span>
									) : (
										<span>{(cartItems.length * quote.price).toFixed(2)} ETH</span>
									)}
								</span>
							</li>

							<li className={styles.listItem}>
								<span>Interest</span>
								<span className={styles.priceWrapper}>
									{/* Show placeholder when fetching interest rates */}
									{fetchingInterest ? (
										<span className="placeholder-container" style={{ width: '7ch', height: '16px' }}></span>
									) : (
										<span>
											{currentAnnualInterest &&
												typeof currentAnnualInterest === 'number' &&
												`${(currentAnnualInterest / 1e18).toFixed(2)}% p.a.`}
										</span>
									)}
								</span>
							</li>

							<li className={styles.listItem}>
								<span>Deadline</span>
								<span className={styles.priceWrapper}>
									{/* Show placeholder when fetching quotation */}
									{fetchingQuote ? (
										<span className="placeholder-container" style={{ width: '7ch', height: '16px' }}></span>
									) : (
										<span>{quote.deadline && new Date(quote.deadline * 1000)?.toLocaleString()}</span>
									)}
								</span>
							</li>
						</ul>
					)}
					{/* Show error message of txs/queries initiated with wallet */}
					{errorMsgOfEthersQueries && <p className={styles.errorMsg}>{errorMsgOfEthersQueries}</p>}

					{isLoading ? (
						<button className={styles.checkoutButton}>
							<BeatLoader />
						</button>
					) : (
						<button className={styles.checkoutButton} onClick={() => approveContract()}>
							Approve
						</button>
					)}
				</>
			)}
		</Dialog>
	)
}
