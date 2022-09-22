import { useRouter } from 'next/router'
import { CSSProperties } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { useGetCartItems } from '~/hooks/useCart'
import styles from './CartButton.module.css'

export default function CartButton() {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	if (!isConnected || chain?.unsupported) {
		return <Wrapper disabled style={{ opacity: '0.7' }} />
	}

	return <ConnectedCartButton />
}

function ConnectedCartButton() {
	const router = useRouter()

	const { data: cartItems } = useGetCartItems(router.pathname === '/' ? 'borrow' : 'repay')

	return <Wrapper noOfItems={cartItems?.length} />
}

function Wrapper({ noOfItems, ...props }: { noOfItems?: number; disabled?: boolean; style?: CSSProperties }) {
	const router = useRouter()

	const { cart } = router.query

	const isCartToggled = typeof cart === 'string' && cart === 'true'

	return (
		<button
			onClick={() =>
				router.push({
					pathname: router.pathname,
					query: { cart: isCartToggled ? false : true }
				})
			}
			className={styles.cartButton}
			{...props}
		>
			<span className="visually-hidden">{isCartToggled ? 'Close Cart' : 'Open Cart'}</span>

			<span className={styles.noOfItems}>{noOfItems || 0}</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		</button>
	)
}
