import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
import RestaurantLayout from 'src/layout/Restaurant';
import UsersDetailLayout from 'src/containers/UsersDetail';

export default class UserDetailPage extends PureComponent {
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
				<CompanyLayout>
					<RestaurantLayout>
						<MainLayout>
							<UsersDetailLayout id={id} />
						</MainLayout>
					</RestaurantLayout>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
