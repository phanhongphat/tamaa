export default {
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
		overflow: 'auto',
		// backgroundImage: `url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg')`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center 110px',
		backgroundSize: '100%'
	},

	content: {
		// padding: '32px 0',
		flex: '1'
	},
	top: {
		textAlign: 'center'
	},

	header: {
		height: '44px',
		lineHeight: '44px',
		'& a': {
			textDecoration: 'none'
		}
	},

	logo: {
		height: '44px',
		verticalAlign: 'top',
		marginRight: '16px'
	},

	title: {
		fontSize: '33px',
		// color: @heading-color,
		fontFamily: `Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif`,
		fontWeight: '600',
		position: 'relative',
		top: '2px'
	},

	desc: {
		// fontSize: @font-size-base,
		// color: @text-color-secondary,
		marginTop: '12px',
		marginBottom: '40px'
	}
};
