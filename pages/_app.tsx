import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { walletTheme } from '~/lib/theme'

const { chains, provider } = configureChains(
	[chain.mainnet, chain.goerli],
	[infuraProvider({ apiKey: 'c580a3487b1241a09f9e27b02c004f5b' })]
)

const { connectors } = getDefaultWallets({
	appName: 'tubby sea',
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
					<RainbowKitProvider theme={walletTheme} chains={chains} initialChain={chain.goerli}>
						{isMounted && <Component {...pageProps} />}
					</RainbowKitProvider>
				</WagmiConfig>
			</Hydrate>
		</QueryClientProvider>
	)
}

export default MyApp
