import React from 'react';

import { Tabs } from 'antd';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import Details from 'src/containers/CompanyDetail/_Details';
import Employees from 'src/containers/CompanyDetail/_Employees';
import Credits from 'src/containers/CompanyDetail/Credits';
import Account from 'src/containers/CompanyDetail/Account';

const { TabPane } = Tabs;

const TabPanel = props => {
	return (
		<Tabs defaultActiveKey={props.tab}>
			<TabPane tab="Détail" key="5s">
				<Details id={props.id} />
			</TabPane>
			<TabPane tab="Employés" key="2">
				<Employees id={props.id} />
			</TabPane>
			<TabPane tab="Crédit" key="3">
				<Credits id={props.id} />
			</TabPane>
			<TabPane tab={<FormattedMessage id="account" defaultMessage="Account" />} key="4">
				{Object.getOwnPropertyNames(props.detail).length !== 0 && (
					<Account details={props.detail} handleGetCompanyDetail={props.handleGetCompanyDetail} />
				)}
			</TabPane>
		</Tabs>
	);
};

export default TabPanel;
