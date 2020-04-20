import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
import Restaurant from 'src/layout/Restaurant';

import CreateCompanyContainer from 'src/containers/CreateCompany';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<CompanyLayout>
					<Restaurant>
						<MainLayout>
							<CreateCompanyContainer />
						</MainLayout>
					</Restaurant>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
