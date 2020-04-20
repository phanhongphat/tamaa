import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import Restaurant from 'src/layout/Restaurant';
import CreateEmployee from 'src/containers/CreateEmployee';

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

		return (
			<AuthLayout>
				<MainLayout>
					<Restaurant>
						<CreateEmployee companyId={id} />
					</Restaurant>
				</MainLayout>
			</AuthLayout>
		);
	}
}
