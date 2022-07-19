import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
	[chain.kovan],
	[alchemyProvider({ alchemyId: 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr' }), publicProvider()]
)

const { connectors } = getDefaultWallets({
	appName: 'Tubby Cats Lending',
	chains
})

const wagmiClient = createClient({
	connectors,
	provider
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains}>
				<Component {...pageProps} />
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default MyApp
