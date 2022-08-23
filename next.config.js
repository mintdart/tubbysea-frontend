/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['cloudflare-ipfs.com', 'api.tubbysea.com', 'res.cloudinary.com']
	},
	experimental: {
		legacyBrowsers: false,
		browsersListForSwc: true
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
