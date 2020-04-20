import React, { PureComponent } from 'react';
import ResetPasswordNewAccountLayout from 'src/containers/ResetPasswordNewAccount';

export default class ResetPasswordPageNewAccount extends PureComponent {
	static getInitialProps({ query }) {
		return { token: query.token };
	}

	render() {
		const { token } = this.props;

		return <ResetPasswordNewAccountLayout token={token} />;
	}
}
