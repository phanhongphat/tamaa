import React, { PureComponent } from 'react';

import ResetPasswordLayout from 'src/containers/ResetPassword';

export default class ResetPasswordPage extends PureComponent {
	static getInitialProps({ query }) {
		return { token: query.token };
	}

	render() {
		const { token } = this.props;

		return <ResetPasswordLayout token={token} />;
	}
}
