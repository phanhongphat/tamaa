import React, { PureComponent } from 'react';

import { Row, Col, Collapse, Typography } from 'antd';

import CreditTable from '../Table';
import CreditConditions from '../CreditConditions';
import BalanceCard from './BalanceCard';
import injectSheet from 'react-jss';
import styles from '../../styles';
// import { datas } from 'src/containers/Company/datas';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const { Panel } = Collapse;
const { Text } = Typography;

@injectSheet(styles)
export default class Credit extends PureComponent {
	state = { visible: false };

	render() {
		const { classes, transactions } = this.props;
		const {
			balance,
			companyConditions,
			id,
			email,
			user,
			employeesBalance,
			dailyAmount,
			expirationDate,
			restriction
		} = this.props && this.props.details;

		// console.log(this.props);
		return (
			<div className={classes.creditFontSize}>
				<Row type="flex" align="middle" justify="space-between" gutter={24}>
					<Col span={12}>
						<BalanceCard
							classes={classes}
							balance={balance}
							name={<FormattedMessage id="employees.balance" defaultMessage="Current Balance" />}
						/>
					</Col>
					<Col span={12}>
						<BalanceCard
							classes={classes}
							balance={employeesBalance}
							name={<FormattedMessage id="companies.employeeBalance" defaultMessage="Employee balance" />}
						/>
					</Col>
				</Row>
				<Row style={{ margin: '10px 0', fontSize: '16px' }}>
					<Col span={18}>
						<Text>Expired date: {expirationDate ? new Date(expirationDate).toLocaleDateString() : ''}</Text>
					</Col>
				</Row>
				<Collapse style={{ boxShadow: '2px 2px 10px lightgrey', marginTop: '16px' }}>
					<Panel
						disabled={user && !user.creditActivated ? true : false}
						header={user && user.creditActivated ? 'Crédit condition' : 'Crédit désactivé'}
						key="1">
						<CreditConditions
							id={id}
							conditions={companyConditions}
							dailyAmount={dailyAmount}
							handleGetCompanyDetail={this.props.handleGetCompanyDetail}
							restriction={restriction}
						/>
					</Panel>
				</Collapse>

				<CreditTable id={user && user.id} email={email} companyId={id} />
			</div>
		);
	}
}
