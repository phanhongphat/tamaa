import React from 'react';
// import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';

import DashBoard from 'src/containers/Dashboard';
// import withIntl from '../lib/withIntl';

class Index extends React.Component {
	// static async getInitialProps({ req }) {
	// 	return { someDate: Date.now() };
	// }

	render() {
		return (
			<AuthLayout>
				<MainLayout>
					<DashBoard />
					{/* <p>
						<FormattedRelative value={this.props.someDate} updateInterval={1000} />
					</p>
					<p>
						<FormattedMessage id="description" defaultMessage="Hello, World!" />
					</p> */}
				</MainLayout>
			</AuthLayout>
		);
	}
}

export default Index;
