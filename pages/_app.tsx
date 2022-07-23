import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

const { chains, provider } = configureChains(
	[chain.mainnet, chain.kovan],
	[infuraProvider({ infuraId: 'c580a3487b1241a09f9e27b02c004f5b' })]
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
