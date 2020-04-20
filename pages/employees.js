import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import Restaurant from 'src/layout/Restaurant';
import EmployeeContainer from 'src/containers/Employee';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<Restaurant>
					<MainLayout>
						<EmployeeContainer />
					</MainLayout>
				</Restaurant>
			</AuthLayout>
		);
	}
}
