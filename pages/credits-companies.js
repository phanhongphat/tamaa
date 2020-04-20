import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
// import AuthLayout from 'src/layout/Auth';
import CreditsHistoryCompanyContainer from 'src/containers/CreditsHistoryCompanies';
import AuthLayout from 'src/layout/Auth';
// import CompanyLayout from 'src/layout/Company';
import Restaurant from 'src/layout/Restaurant';
import EmployeesLayout from 'src/layout/Employees';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<Restaurant>
					<EmployeesLayout>
						<MainLayout>
							<CreditsHistoryCompanyContainer />
						</MainLayout>
					</EmployeesLayout>
				</Restaurant>
			</AuthLayout>
		);
	}
}
