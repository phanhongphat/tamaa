import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';

import CreditsDetailsContainer from 'src/containers/CreditsDetail';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<MainLayout>
					<CreditsDetailsContainer />
				</MainLayout>
			</AuthLayout>
		);
	}
}
