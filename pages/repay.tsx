import type { NextPage } from 'next'
import Layout from '~/components/Layout'
import TubbyCard from '~/components/TubbyCard'
import TubbyGrid from '~/components/TubbyGrid'

const Repay: NextPage = () => {
	return (
		<Layout>
			<TubbyGrid>
				{new Array(10).fill('tubby').map((_, index) => (
					<TubbyCard key={index} id="9204" imgUrl="/minty.jpeg" type="repay" />
				))}
			</TubbyGrid>
		</Layout>
	)
}

export default Repay
