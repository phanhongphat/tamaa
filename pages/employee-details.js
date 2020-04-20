import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import Restaurant from 'src/layout/Restaurant';
import EmployeeDetailsContainer from 'src/containers/EmployeeDetails';
import AuthStorage from 'src/utils/AuthStorage';

export default class RegisterPage extends PureComponent {
	static async getInitialProps(ctx) {
		// query.slug
		const { id } = ctx.query;

		return {
			id
		};
	}

	render() {
		const { id } = this.props;

		if (AuthStorage.role === 'ROLE_EMPLOYEE' && AuthStorage.id !== id) {
			return null;
		}
		return (
			<AuthLayout>
				<Restaurant>
					<MainLayout>
						<EmployeeDetailsContainer id={id} />
					</MainLayout>
				</Restaurant>
			</AuthLayout>
		);
	}
}
