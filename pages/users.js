import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
import RestaurantLayout from 'src/layout/Restaurant';
import SettingUsersLayout from 'src/containers/Users';

export default class UserPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<CompanyLayout>
					<RestaurantLayout>
						<MainLayout>
							<SettingUsersLayout />
						</MainLayout>
					</RestaurantLayout>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
