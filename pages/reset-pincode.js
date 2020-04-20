import React, { PureComponent } from 'react';
import ResetPincodeLayout from 'src/containers/ResetPincode';

export default class ResetPincodePage extends PureComponent {
	static getInitialProps({ query }) {
		return { token: query.token };
	}

	render() {
		const { token } = this.props;
		//const token = '7b0f50480dce5225a317774113bde479';
		return <ResetPincodeLayout token={token} />;
	}
}
