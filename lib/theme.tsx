import { Theme } from '@rainbow-me/rainbowkit'

export const walletTheme: Theme = {
	colors: {
		accentColor: '#3898FF',
		accentColorForeground: '#FFF',
		actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
		actionButtonBorderMobile: 'rgba(255, 255, 255, 0.1)',
		actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
		closeButton: 'rgba(255, 255, 255, 0.7)',
		closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
		connectButtonBackground: '#000',
		connectButtonBackgroundError: '#FF494A',
		connectButtonInnerBackground: 'linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12))',
		connectButtonText: '#FFF',
		connectButtonTextError: '#FFF',
		connectionIndicator: '#30E000',
		error: '#FF494A',
		generalBorder: 'rgba(255, 255, 255, 0.08)',
		generalBorderDim: 'rgba(255, 255, 255, 0.04)',
		menuItemBackground: 'rgba(255, 255, 255, 0.08)',
		modalBackdrop: 'rgba(0, 0, 0, 0.4)',
		modalBackground: '#24262a',
		modalBorder: 'rgba(255, 255, 255, 0.08)',
		modalText: '#FFF',
		modalTextDim: 'rgba(255, 255, 255, 0.2)',
		modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
		profileAction: 'rgba(255, 255, 255, 0.1)',
		profileActionHover: 'rgba(255, 255, 255, 0.2)',
		profileForeground: 'rgba(255, 255, 255, 0)',
		selectedOptionBorder: 'rgba(224, 232, 255, 0.1)',
		standby: '#FFD641'
	},
	fonts: {
		body: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol'
	},
	radii: {
		actionButton: '12px',
		connectButton: '12px',
		menuButton: '12px',
		modal: '12px',
		modalMobile: '12px'
	},
	shadows: {
		connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
		dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
		profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
		selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
		selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.24)',
		walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)'
	},
	blurs: {
		modalOverlay: 'blur(0px)'
	}
}
