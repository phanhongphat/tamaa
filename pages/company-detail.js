import React, { PureComponent } from 'react';

import Head from 'next/head';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import Restaurant from 'src/layout/Restaurant';

import CompanyDetailLayout from 'src/containers/CompanyDetail';

import AuthStorage from 'src/utils/AuthStorage';
import { Router, Link } from 'src/routes';

export default class RegisterPage extends PureComponent {
	static async getInitialProps(ctx) {
		// query.slug
		const { id, tab } = ctx.query;

		const arr = [id, tab];

		return {
			arr
		};
	}

	componentDidMount() {
		// let { id } = this.props;
		const { arr } = this.props;
		const id = arr[0];
		const { idInfo, isCompany } = AuthStorage;
		if (typeof idInfo === 'string' && isCompany && id !== idInfo.toString()) {
			Router.pushRoute('/');
		}
	}

	render() {
		// const { id } = this.props;
		const { arr } = this.props;
		const id = arr[0];
		const tab = arr[1];
		const { idInfo, isCompany } = AuthStorage;

		if (typeof idInfo === 'string' && isCompany && id !== idInfo.toString()) {
			return <div />;
		}

		return (
			<AuthLayout>
				<Restaurant>
					<MainLayout>
						<CompanyDetailLayout id={isCompany ? idInfo : id} tab={tab || 1} />
					</MainLayout>
				</Restaurant>
			</AuthLayout>
		);
	}
}
