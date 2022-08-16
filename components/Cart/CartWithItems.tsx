import * as React from 'react'
import Image from 'next/image'
import { useBalance } from 'wagmi'
import BeatLoader from '~/components/BeatLoader'
import ItemsPlaceholder from './ItemsPlaceholder'
import { useGetCartItems, useSaveItemToCart } from '~/hooks/useCart'
import { useGetQuote } from '~/hooks/useQuotation'
import { useGetInterest } from '~/hooks/useInterest'
import { useGetContractApproval, useSetContractApproval } from '~/hooks/useContractApproval'
import { useBorrow } from '~/hooks/useBorrow'
import { useGetNftsList } from '~/hooks/useNftsList'
import { LENDING_POOL_ADDRESS } from '~/lib/contracts'
import styles from './Cart.module.css'

const formatErrorMsg = (error: any) => {
	if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
		return 'Cannot estimate gas, Transaction may fail or may require manual gas limit.'
	} else return error.reason
}

export function CartWithItems() {
	const { isLoading: fetchingNftsList } = useGetNftsList('borrow')

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
		error: errorApproving,
		waitForTransaction: {
			data: approvalTxOnChain,
			isLoading: checkingForApproveTxOnChain,
			error: txApproveErrorOnChain
		}
	} = useSetContractApproval()

	// query to check approval of all tokens
	const {
		data: isApprovedForAll,
		isLoading: fetchingIfApproved,
		error: failedToFetchIfApproved
	} = useGetContractApproval()

	//query to borrow eth using nfts
	const {
		mutationDisabled,
		write: borrowETH,
		isLoading: userConfirmingBorrow,
		error: errorConfirmingBorrow,
		waitForTransaction: { data: borrowTxOnChain, isLoading: checkingForBorrowTxOnChain, error: txBorrowErrorOnChain }
	} = useBorrow()

	const {
		data: contractBalance,
		error: errorFetchingContractBalance,
		isLoading: fethcingContractBalance
	} = useBalance({
		addressOrName: LENDING_POOL_ADDRESS
	})

	const isApproved = isApprovedForAll || approvalTxOnChain?.status === 1

	// construct error messages
	// Failed queries, but user can't retry with data of these queries
	const errorMsgOfQueries = errorLoadingCartItems
		? "Couldn't fetch items in your cart"
		: errorFetchingQuote
		? "Couldn't fetch price quotation"
		: errorFetchingInterest
		? "Couldn't fetch interest rate"
		: null

	// Failed queries, but user can retry
	const errorMsgOfEthersQueries = failedToFetchIfApproved
		? failedToFetchIfApproved?.message
		: errorApproving
		? formatErrorMsg(errorApproving)
		: txApproveErrorOnChain
		? txApproveErrorOnChain?.message
		: approvalTxOnChain?.status === 0
		? 'Transaction failed, please try again'
		: errorConfirmingBorrow
		? errorConfirmingBorrow?.message
		: txBorrowErrorOnChain
		? txBorrowErrorOnChain?.message
		: borrowTxOnChain?.status === 0
		? 'Transaction failed, please try again'
		: errorFetchingContractBalance
		? errorFetchingContractBalance.message
		: null

	// check all loading states to show beat loader
	const isLoading =
		fetchingNftsList ||
		fetchingCartItems ||
		fetchingQuote ||
		fetchingInterest ||
		approvingContract ||
		checkingForApproveTxOnChain ||
		fetchingIfApproved ||
		userConfirmingBorrow ||
		checkingForBorrowTxOnChain ||
		fethcingContractBalance

	const canUserBorrowETH =
		contractBalance && cartItems && quote?.price
			? Number((cartItems.length * quote.price).toFixed(2)) < Number(contractBalance.formatted)
			: false

	return (
		<>
			{errorMsgOfQueries ? (
				<p className={`${styles.emptyMsg} ${styles.errorMsg}`}>{errorMsgOfQueries}</p>
			) : cartItems && cartItems.length <= 0 ? (
				<p className={styles.emptyMsg}>Your cart is empty. Fill it with NFTs to borrow ETH.</p>
			) : (
				<>
					{/* Show placeholder when fetching items in cart */}
					{fetchingCartItems || fetchingNftsList ? (
						<ItemsPlaceholder />
					) : (
						<ul className={styles.list}>
							{cartItems?.map(({ tokenId, imgUrl }) => (
								<li key={tokenId} className={styles.listItem}>
									<button className={styles.removeButton} onClick={() => saveItemToCart({ tokenId })}>
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
									<Image
										src={imgUrl || '/tubbycats.png'}
										width="40px"
										height="40px"
										objectFit="cover"
										alt={`token id ${tokenId}`}
									/>
									<span className={styles.itemDetails}>
										<span>{`#${tokenId}`}</span>
										<span className={styles.collectionName}>tubby cats</span>
									</span>

									<span className={styles.priceWrapper}>
										<Image src="/ethereum.png" height="16px" width="16px" objectFit="contain" alt="ethereum" />
										<span>{quote?.price?.toFixed(2)}</span>
									</span>
								</li>
							))}
						</ul>
					)}

					<hr />

					<h2 className={styles.detailsHeader}>Loan Details</h2>

					{/* These values are always truth as error and loading states are handles, but adding a check satisfy typescript compiler  */}
					{cartItems && quote && cartItems?.length > 0 && quote?.price && (
						<ul className={styles.list}>
							<li className={styles.listItem}>
								<span className={styles.detailName}>You Receive</span>
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
								<span className={styles.detailName}>Interest</span>
								<span className={styles.priceWrapper}>
									{/* Show placeholder when fetching interest rates */}
									{fetchingInterest ? (
										<span className="placeholder-container" style={{ width: '7ch', height: '16px' }}></span>
									) : (
										<span>{currentAnnualInterest && `${currentAnnualInterest}% p.a.`}</span>
									)}
								</span>
							</li>

							<li className={styles.listItem}>
								<span className={styles.detailName}>Deadline</span>
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
					) : isApproved ? (
						canUserBorrowETH ? (
							<button
								className={styles.checkoutButton}
								onClick={() => borrowETH?.()}
								disabled={!borrowETH || mutationDisabled}
							>
								Confirm Borrow
							</button>
						) : (
							<>
								<button className={styles.checkoutButton} data-not-allowed disabled={true}>
									Borrow limit reached
								</button>
								<p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '-12px' }}>
									Try removing some items from your cart
								</p>
							</>
						)
					) : (
						<button
							className={styles.checkoutButton}
							onClick={() => approveContract?.()}
							disabled={!approveContract || errorMsgOfQueries ? true : false}
						>
							Approve
						</button>
					)}
				</>
			)}
		</>
	)
}
