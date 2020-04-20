import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Row, Col, Card, Typography, Spin, Icon } from 'antd';
const { Title, Text } = Typography;
import CONSTANTS from 'src/constants';

import CharCompany from './Chart/Company';
import CharRetaurants from './Chart/Retaurants';
import numberWithSpaces from 'src/utils';

import styles from './styles';

//redux
import { getAmountInfotRequest } from 'src/redux/actions/dashborad';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			amountInfo: state.dashboard.amountInfo
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListCreditDetails
				getAmountInfotRequest
			},
			dispatch
		)
	};
};

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class TamaLayout extends PureComponent {
	state = {
		loading: false
	};

	componentDidMount() {
		this.handelGetAmountInfo();
	}

	handelGetAmountInfo = () => {
		this.setState({ loading: true });
		this.props.action.getAmountInfotRequest(
			{},
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
				amountInfo: { data = {} }
			}
		} = this.props;

		const { loading } = this.state;
		const date = new Date();
		const monthOfYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
		return (
			<div className="gutter-example">
				<Row gutter={24} style={{ marginBottom: '15px' }}>
					<Col span={8}>
						<Spin spinning={loading}>
							<Card bordered={false}>
								<Title type="secondary" level={4}>
									Credits company - {monthOfYear}
								</Title>
								<Title style={{ color: '#00C68E' }}>
									{data.total_amount_credit_company
										? numberWithSpaces(data.total_amount_credit_company)
										: '0'}{' '}
									<span style={{ fontSize: '11px' }}>{CONSTANTS.CURRENCY}</span>
								</Title>
							</Card>
						</Spin>
					</Col>
					<Col span={8}>
						<Spin spinning={loading}>
							<Card bordered={false}>
								<Title type="secondary" level={4}>
									Transactions restaurants - {monthOfYear}
								</Title>
								<Title style={{ color: '#00C68E' }}>
									{data.total_amount_credit_restaurant
										? numberWithSpaces(data.total_amount_credit_restaurant)
										: '0'}{' '}
									<span style={{ fontSize: '11px' }}>{CONSTANTS.CURRENCY}</span>
								</Title>
							</Card>
						</Spin>
					</Col>
					<Col span={8}>
						<Spin spinning={loading}>
							<Card bordered={false}>
								<Title type="secondary" level={4}>
									Users online
								</Title>
								<Title style={{ color: '#00C68E' }}>
									{data.total_amount_users_logged_in_app_now || '0'}{' '}
									<span style={{ fontSize: '11px' }}>online</span>
								</Title>
							</Card>
						</Spin>
					</Col>
				</Row>
				<Row gutter={24} style={{ marginBottom: '20px' }}>
					<Col span={12}>
						<CharCompany />
					</Col>
					<Col span={12}>
						<CharRetaurants />
					</Col>
				</Row>
			</div>
		);
	}
}
