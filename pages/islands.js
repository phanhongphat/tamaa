import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import IslandsLayout from 'src/containers/Islands';

export default class UserPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<MainLayout>
					<IslandsLayout />
				</MainLayout>
			</AuthLayout>
		);
	}
}
