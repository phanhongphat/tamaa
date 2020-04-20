import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Row, Col, Card, Typography, Spin } from 'antd';
const { Title, Text } = Typography;

import Chart from './Chart';
import AuthStorage from 'src/utils/AuthStorage';
import styles from './styles';
import CONSTANTS from 'src/constants';

import { getDashboardCompany } from 'src/redux/actions/dashborad.js';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			company: state.dashboard.company
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListCreditDetails
				getDashboardCompany
			},
			dispatch
		)
	};
};

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class CompanyLayout extends PureComponent {
	state = {
		loading: true
	};

	filter = {
		limit: 12
	};

	componentDidMount() {
		const filter = this.filter;
		this.handelGetDashboardCompany(filter);
	}

	handelGetDashboardCompany = filter => {
		const { userId } = AuthStorage;
		const payload = {
			id: userId
			// params: filter
		};
		this.setState({ loading: true });
		this.props.action.getDashboardCompany(
			payload,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	render() {
		const {
			classes,
			store: {
				company: { data = {} }
			}
		} = this.props;
		const { loading } = this.state;
		const dataChart = data.credit_history || [];
		return (
			<div className="gutter-example">
				<Row gutter={24} style={{ marginBottom: '15px' }}>
					<Col span={12}>
						<Spin spinning={loading}>
							<Card bordered={false}>
								<Title type="secondary" level={4}>
									Current Balance
								</Title>
								<Title style={{ color: '#00C68E' }}>
									{data.balance_info && numberWithSpaces(data.balance_info.company_current_balance)}{' '}
									<span style={{ fontSize: '11px' }}>{CONSTANTS.CURRENCY}</span>
								</Title>
							</Card>
						</Spin>
					</Col>
					<Col span={12}>
						<Spin spinning={loading}>
							<Card bordered={false}>
								<Title type="secondary" level={4}>
									Employees balance
								</Title>
								<Title type="primary" style={{ color: '#00C68E' }}>
									{data.balance_info && numberWithSpaces(data.balance_info.employee_total_balance)}{' '}
									<span style={{ fontSize: '11px' }}>{CONSTANTS.CURRENCY}</span>
								</Title>
							</Card>
						</Spin>
					</Col>
				</Row>
				<Row>
					<Col>
						<Spin spinning={loading}>
							<Chart data={dataChart} />
						</Spin>
					</Col>
				</Row>
			</div>
		);
	}
}
