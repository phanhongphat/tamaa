import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
import RestaurantLayout from 'src/layout/Restaurant';
import SettingMetadataLayout from 'src/containers/SettingMetadata';

export default class RegisterPage extends PureComponent {
	render() {
		return (
			<AuthLayout>
				<CompanyLayout>
					<RestaurantLayout>
						<MainLayout>
							<SettingMetadataLayout />
						</MainLayout>
					</RestaurantLayout>
				</CompanyLayout>
			</AuthLayout>
		);
	}
}
