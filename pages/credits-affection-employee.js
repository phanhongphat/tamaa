import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CreditsAffectionEmployeeContainer from 'src/containers/CreditsAffectionEmployee';
import AuthStorage from 'src/utils/AuthStorage';
export default class CreditsAffectionEmployeePage extends PureComponent {
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
				<MainLayout>
					<CreditsAffectionEmployeeContainer id={id} />
				</MainLayout>
			</AuthLayout>
		);
	}
}
