import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const { chains, provider } = configureChains(
	[chain.mainnet, chain.kovan],
	[alchemyProvider({ alchemyId: 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr' }), publicProvider()]
)

const { connectors } = getDefaultWallets({
	appName: 'tubby cats lending',
	chains
})

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
					<RainbowKitProvider chains={chains} initialChain={chain.kovan}>
						{isMounted && <Component {...pageProps} />}
					</RainbowKitProvider>
				</WagmiConfig>
			</Hydrate>
		</QueryClientProvider>
	)
}

export default MyApp
