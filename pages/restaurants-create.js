import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
import Restaurant from 'src/layout/Restaurant';
import RestaurantCreateLayout from 'src/containers/RestaurantCreate';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<CompanyLayout>
					<Restaurant>
						<MainLayout>
							<RestaurantCreateLayout />
						</MainLayout>
					</Restaurant>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
