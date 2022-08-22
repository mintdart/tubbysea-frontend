import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<link rel="manifest" href="/favicon/site.webmanifest" />
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<link rel="manifest" href="/favicon/site.webmanifest" />
				<link rel="preload" href="/Quicksand.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
				<meta
					name="description"
					content="tubby sea is a lending protocol that allows you to deposit tubby cats in order to borrow ETH."
				/>

				<meta property="og:title" content="tubby sea" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="tubby sea" />
				<meta
					property="og:description"
					content="tubby sea is a lending protocol that allows you to deposit tubby cats in order to borrow ETH."
				/>
				<meta property="og:image" content="https://borrow.tubbysea.com/og.png" />
				<meta property="og:url" content="https://borrow.tubbysea.com" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="borrow.tubbysea.com" />
				<meta name="twitter:title" content="tubby sea" />
				<meta
					name="twitter:description"
					content="tubby sea is a lending protocol that allows you to deposit tubby cats in order to borrow ETH."
				/>
				<meta name="twitter:image" content="https://borrow.tubbysea.com/og.png" />
				<meta property="twitter:url" content="https://borrow.tubbysea.com" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
