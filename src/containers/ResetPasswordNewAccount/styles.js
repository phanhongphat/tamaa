export default {
	wrapLeft: {
		padding: '3rem 3rem',
		background: '#fff',
		height: '100vh'
	},
	leftBody: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%'
	},
	wrapRight: {
		backgroundImage: "url('/static/assets/images/bg/bg-4.png')",
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		padding: '3rem 3.5rem',
		position: 'relative',
		'&:before': {
			content: '""',
			position: 'absolute',
			bottom: 0,
			left: 0,
			top: 0,
			right: 0,
			display: 'block',
			backgroundColor: '#00c68e',
			zIndex: 1,
			opacity: 0.5
		}
	},
	contentRight: {
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
		zIndex: 2
	},
	midRight: {
		flex: '2',
		'& h3': {
			color: '#fff',
			fontSize: '4rem',
			fontWeight: '900'
		}
	},
	topRight: {
		flex: '1'
	},
	bottomRight: {
		display: 'flex',
		justifyContent: 'space-between',
		color: '#fff'
	},
	menu: {
		'& a': {
			textDecoration: 'none',
			color: 'rgba(255,255,255,.7)',
			marginLeft: '2rem',
			display: 'inline-block',
			'&:hover': {
				color: '#fff',
				textDecoration: 'underline'
			}
		}
	},
	warp: {},
	form: {
		width: '100%',
		maxWidth: '450px'
	},
	wrapLogo: {
		height: '80px',
		'& img': {
			height: '100%'
		}
	},
	'@media screen and (min-width: 360px)': {
		wrapRight: {
			display: 'none'
		}
	},
	'@media screen and (min-width: 600px)': {
		wrapRight: {
			display: 'flex'
		}
	}
};
