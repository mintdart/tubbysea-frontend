import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { connectorsForWallets, wallet, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { walletTheme } from '~/lib/theme'
import { chainConfig } from '~/lib/constants'

const { chains, provider } = configureChains(
	[chain.mainnet, chain.goerli],
	[
		jsonRpcProvider({
			rpc: (chain) => {
				if (chain.id === 1) {
					return { http: chainConfig[1].ankrUrl }
				} else if (chain.id === 5) {
					return { http: chainConfig[5].ankrUrl }
				} else return { http: chain.rpcUrls.default }
			}
		}),
		publicProvider()
	]
)

const connectors = connectorsForWallets([
	{
		groupName: 'Popular',
		wallets: [wallet.rainbow({ chains }), wallet.metaMask({ chains }), wallet.walletConnect({ chains })]
	},
	{
		groupName: 'More',
		wallets: [wallet.argent({ chains }), wallet.trust({ chains }), wallet.ledger({ chains })]
	}
])

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
})

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = React.useState(() => new QueryClient())

	const [isMounted, setIsMounted] = React.useState(false)
	React.useEffect(() => setIsMounted(true), [])

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<WagmiConfig client={wagmiClient}>
					<RainbowKitProvider
						theme={walletTheme}
						chains={chains}
						initialChain={chain.goerli}
						showRecentTransactions={true}
					>
						{isMounted && <Component {...pageProps} />}
					</RainbowKitProvider>
				</WagmiConfig>
			</Hydrate>
		</QueryClientProvider>
	)
}

export default MyApp
