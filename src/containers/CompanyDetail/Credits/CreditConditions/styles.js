export default {
	layout: {
		backgroundColor: 'white ',
		marginTop: '50px'
	},
	narrow: {
		marginBottom: '15px'
	},
	group: {
		display: 'block'
	},
	left: {
		float: 'left',
		width: '60%',
		paddingBottom: '20px'
	},
	right: {
		float: 'right',
		width: '40%'
	},
	'@media screen and (max-width: 1400px)': {
		left: {
			width: '100%',
			float: 'none'
		},
		right: {
			width: '100%',
			float: 'none'
		}
	}
	// '@media screen and (max-width: 500px)': {
	// 	left: {
	// 		width: '100%'
	// 	},
	// 	right: {
	// 		width: '100%'
	// 	}
	// }
};
