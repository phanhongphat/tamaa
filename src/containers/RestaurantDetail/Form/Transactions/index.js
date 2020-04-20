import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Layout, Input, Icon, Menu, Dropdown, Button, message, DatePicker, Card, Col, Row, Typography } from 'antd';
import Table from 'src/containers/RestaurantDetail/Form/Transactions/Table/index';
import styles from './styles';
import { getListTransactions, getTransactionsByUserId, getTransactionsByUserIdOfEmployee } from 'src/redux/actions/transactions.js';
import moment from 'moment';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import BtnExport from 'src/components/Button/BtnExport';
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Search } = Input;
function mapStateToProps(state) {
	return {
		store: {
			transactions: state.transactions.list
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListTransactions,
				getTransactionsByUserId,
				getTransactionsByUserIdOfEmployee
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
export default class RestaurantTransactionsContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		isClickedFilter: false,
		visible: false
	};

	componentDidMount() {
		const { details } = this.props;
		const payload = {
			type: 1,
            creditor: details.user.id,
			pagination: false
		};
		this.props.action.getListTransactions(
			payload,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	}

	handleFilterDatesTransactions = (e, dataString) => {
		const { details } = this.props;

		if (e[0] && e[1]) {
			e[0] = moment(e[0]).startOf('date');
			e[1] = moment(e[1]).endOf('date');

			// if (e[0] === e.[1])
			const payload = {
				'date[after]': e[0],
				'date[before]': e[1],
                type: 1,
                creditor: details.user.id,
                pagination: false
			};
			this.props.action.getListTransactions(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		} else {
			const payload = {
                type: 1,
                creditor: details.user.id,
                pagination: false
			};
			this.props.action.getListTransactions(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		}
	};

	_onChangeTabs = key => {
		console.log(key);
	};
	_onChangeDatePicker(date, dateString) {
		console.log(date, dateString);
	}
	_filter = () => {
		this.setState({
			isClickedFilter: !this.state.isClickedFilter
		});
	};
	_createEmployee = () => {};
	hide = () => {
		this.setState({
			visible: false
		});
	};

	_handleVisibleChange = visible => {
		this.setState({ visible });
	};

	handleButtonClick(e) {
		message.info('Click on left button.');
		console.log('click left button', e);
	}

	handleMenuClick(e) {
		message.info('Click on menu item.');
		console.log('click', e);
	}
	menu = (
		<Menu onClick={this.handleMenuClick}>
			<Menu.Item key="1">
				<Icon type="user" />
				1st menu item
			</Menu.Item>
			<Menu.Item key="2">
				<Icon type="user" />
				2nd menu item
			</Menu.Item>
			<Menu.Item key="3">
				<Icon type="user" />
				3rd item
			</Menu.Item>
		</Menu>
	);
	menufilter = (
		<Menu>
			<Menu.Item key="employee-filter">
				<div
					style={{
						//backgroundColor: '#E3EAEA  ',
						alignItems: 'center',
						marginLeft: 'auto',
						marginRight: 'auto',
						display: 'flex',

						position: 'relative'
					}}>
					<div
						style={{
							paddingLeft: '32px',
							paddingRight: '16px'
						}}>
						By company
					</div>
					<div
						style={{
							height: '64px',
							alignItems: 'center',
							justifyContent: 'center',
							display: 'flex',
							flexDirection: 'column'
						}}>
						<Dropdown overlay={this.menu} trigger={['click']} placement="bottomLeft">
							<div>
								Company name <Icon type="down" />
							</div>
						</Dropdown>
						<div
							style={{
								marginTop: '10px',
								width: '100%',
								height: '1px',
								background: '#000'
							}}
						/>
					</div>
				</div>
			</Menu.Item>
		</Menu>
	);
	menuMore = (
		<Menu>
			<Menu.Item key="restaurant-more-refund">
				<Icon type="undo" />
				Refund
			</Menu.Item>
			<Menu.Item key="restaurant-more-deactive">
				<Icon type="close-circle" />
				Deactive
			</Menu.Item>
			<Menu.Item key="restaurant-more-delete">
				<Icon type="delete" />
				Delete
			</Menu.Item>
			<Menu.Item key="restaurant-more-import">
				<Icon type="import" />
				Import
			</Menu.Item>
			<Menu.Item key="restaurant-more-download">
				<Icon type="download" />
				Download sample file
			</Menu.Item>
			<Menu.Item key="restaurant-more-export">
				<Icon type="export" />
				Export
			</Menu.Item>
		</Menu>
	);

	render() {
		const {
			classes,
			store: { user = {}, transactions = {} }
		} = this.props;

		return (
			<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
				<Row type="flex" justify="space-between">
					<Col>
						<Row type="flex" justify="start" align="middle" style={{ height: '100%' }}>
							<RangePicker
								className={classes.creditDatePicker}
								ranges={{
									Today: [moment().startOf('date'), moment().endOf('date')],
									'This Month': [moment().startOf('month'), moment().endOf('month')]
								}}
								format="DD/MM/YYYY"
								onChange={this.handleFilterDatesTransactions}
							/>
						</Row>
					</Col>
					<Col style={{ padding: '8px 0' }}>
						<Row>
							<Col span={12}>
								<BtnExport
									data={transactions.data}
									textBtn={
										<Button
											className={classes.formButton}
											value="export"
											icon="export"
											type="primary">
											<FormattedMessage id="export" defaultMessage="Export" />
										</Button>
									}
									filename="Transaction_Restaurant-list.csv"
								/>
							</Col>
						</Row>
					</Col>
				</Row>

				<Row className={classes.main}>
					<Table data={transactions.data} />
				</Row>
			</Card>
		);
	}
}
