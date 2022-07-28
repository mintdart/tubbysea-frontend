/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['cloudflare-ipfs.com']
	},
	async redirects() {
		return [
			{
				source: '/borrow',
				destination: '/',
				permanent: true
			}
		]
	}
}

module.exports = nextConfig
