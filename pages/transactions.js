import React, { PureComponent } from 'react';

import AuthLayout from 'src/layout/Auth';
import MainLayout from 'src/layout/Main';
import CompanyLayout from 'src/layout/Company';
import TransactionContainer from 'src/containers/Transactions';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<MainLayout>
					<CompanyLayout>
						<TransactionContainer />
					</CompanyLayout>
				</MainLayout>
			</AuthLayout>
		);
	}
}
