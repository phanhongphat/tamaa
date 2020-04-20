import React, { PureComponent } from 'react';
import { Router } from 'src/routes';

import AuthStorage from 'src/utils/AuthStorage';
import ForgotPassword from 'src/containers/ForgotPassword';

export default class ForgotPasswordPage extends PureComponent {
	componentDidMount() {
		if (AuthStorage.loggedIn) {
			Router.pushRoute('/');
		}
	}

	render() {
		return <ForgotPassword />;
	}
}
