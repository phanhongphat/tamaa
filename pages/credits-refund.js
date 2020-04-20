import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CreditsRefundContainer from 'src/containers/CreditsRefund';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<MainLayout>
				<CreditsRefundContainer />
			</MainLayout>
		);
	}
}
