import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
// import AuthLayout from 'src/layout/Auth';
import CreditsHistoryEmployeeContainer from 'src/containers/CreditsHistoryEmployees';
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
							<CreditsHistoryEmployeeContainer />
						</MainLayout>
					</EmployeesLayout>
				</Restaurant>
			</AuthLayout>
		);
	}
}
