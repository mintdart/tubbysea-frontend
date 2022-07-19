import type { NextPage } from 'next'
import { useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import Layout from '~/components/Layout'
import TubbyCard from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'
import { NFTS_LIST_ABI, NFTS_LIST_CONTRACT } from '~/contracts'
import { getAddress } from 'ethers/lib/utils'

const Home: NextPage = () => {
	// const { data, isError, isLoading } = useContractRead({
	// 	addressOrName: getAddress(NFTS_LIST_CONTRACT),
	// 	contractInterface: NFTS_LIST_ABI,
	// 	functionName: 'getOwnedNfts',
	// 	args: [
	// 		getAddress('0xcf85C40f864736eC9513840C476e35375926E96c'),
	// 		getAddress('0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b'),
	// 		new BigNumber(0).times(1e18).toFixed(0),
	// 		new BigNumber(1636333).times(1e18).toFixed(0)
	// 	]
	// })

	return (
		<Layout>
			<TubbyGrid>
				{new Array(10).fill('tubby').map((_, index) => (
					<TubbyCard key={index} id="9204" imgUrl="/minty.jpeg" type="borrow" />
				))}
			</TubbyGrid>
		</Layout>
	)
}

export default Home
