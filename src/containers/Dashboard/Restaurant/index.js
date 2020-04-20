import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Row, Col, Typography, Card, Spin } from 'antd';
const { Title, Text } = Typography;
import { Link } from 'routes';

import Chart from './Chart';
import AuthStorage from 'src/utils/AuthStorage';

import styles from './styles';

import { getDashboardRestaurent } from 'src/redux/actions/dashborad.js';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			restaurant: state.dashboard.restaurant
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListCreditDetails
				getDashboardRestaurent
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
export default class RestaurantLayout extends PureComponent {
	state = {
		loading: true
	};

	filter = {
		limit: 12
	};

	componentDidMount() {
		const filter = this.filter;
		this.handelGetDashboardRestaurent(filter);
	}

	handelGetDashboardRestaurent = filter => {
		const { userId } = AuthStorage;
		const payload = {
			// id: userId
			// params: filter
		};
		this.setState({ loading: true });
		this.props.action.getDashboardRestaurent(
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
			store: {
				restaurant: { data = [] }
			}
		} = this.props;

		const { loading } = this.state;

		const dataChart = data.income_history || [];
		return (
			<div className="gutter-example">
				<Row gutter={24} style={{ marginBottom: '15px' }}>
					<Col span={8}>
						<Card spinning={loading}>
							<Card bordered={false}>
								<Title type="secondary" level={4}>
									Current Balance
								</Title>
								<Title style={{ color: '#00C68E' }}>
									{data.restaurant_current_balance || '0'}{' '}
									<span style={{ fontSize: '11px' }}>FCB</span>
								</Title>
							</Card>
						</Card>
					</Col>
				</Row>
				<Row style={{ marginBottom: '20px' }}>
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
