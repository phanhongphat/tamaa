import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
import Restaurant from 'src/layout/Restaurant';
import CreateUser from 'src/containers/CreateUser';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<CompanyLayout>
					<Restaurant>
						<MainLayout>
							<CreateUser />
						</MainLayout>
					</Restaurant>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
