import type { NextPage } from 'next'
import Image from 'next/image'
import * as React from 'react'

const OG: NextPage = () => {
	return (
		<div style={{ height: '100vh', width: '100vw', background: 'white', display: 'grid', placeItems: 'center' }}>
			<div
				style={{
					height: '631px',
					width: '1200px',
					background: '#222222',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Image src="/paw.png" alt="tubbysea" height="250px" width="250px" />
				<h1
					style={{
						fontFamily: 'Quicksand',
						fontVariationSettings: "'wght' 700",
						fontSize: '10rem',
						marginRight: '37px'
					}}
				>
					tubby sea
				</h1>
			</div>
		</div>
	)
}

export default OG
