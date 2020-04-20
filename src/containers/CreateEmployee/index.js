import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import styles from './styles';
import { Layout, Divider, Button, Dropdown, Icon, Input, Card } from 'antd';
import { WrappedCreateEmployeeForm } from './Form';
import Breadcrumb from 'src/components/Breadcrumb';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import AuthStorage from 'src/utils/AuthStorage';
let id = undefined;
@injectSheet(styles)
export default class CreateEmployee extends PureComponent {
	render() {
		const routes = [
			{
				path: '/employees',
				breadcrumbName: <FormattedMessage id="employees.name" defaultMessage="Employees" />
			},
			{
				breadcrumbName: <FormattedMessage id="employee.create" defaultMessage="Create Employee" />
			}
		];
		const { idInfo, isCompany } = AuthStorage;
		if (isCompany) {
			id = idInfo;
		} else id = this.props.companyId;
		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					//  title="ss"
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<WrappedCreateEmployeeForm companyId={id} />
				</Card>
			</>
		);
	}
}
