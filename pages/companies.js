import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import Restaurant from 'src/layout/Restaurant';
import CompanyLayout from 'src/layout/Company';

import CompanyContainer from 'src/containers/Company';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<CompanyLayout>
					<Restaurant>
						<MainLayout>
							<CompanyContainer />
						</MainLayout>
					</Restaurant>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
