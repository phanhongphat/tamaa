import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CreditsAffectionContainer from 'src/containers/CreditsAffection';

export default class CreditsAffectionPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<MainLayout>
					<CreditsAffectionContainer />
				</MainLayout>
			</AuthLayout>
		);
	}
}
