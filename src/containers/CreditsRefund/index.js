import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NumericInput from 'src/components/Input/NumericInput';
import injectSheet from 'react-jss';
import {
	Input,
	Col,
	Card,
	Icon,
	Menu,
	Dropdown,
	Divider,
	Button,
	Row,
	Typography,
	Modal,
	Form,
	message,
	Spin
} from 'antd';
import { getListRestaurant, getSearchListRestaurantRequest } from 'src/redux/actions/restaurant';
import { refundRestaurant } from 'src/redux/actions/creditRefund.js';
import TableRefundRestaurant from 'src/containers/CreditsRefund/Table';
import styles from './styles';
import HeaderContent from 'src/components/HeaderContent';
import Breadcrumb from 'src/components/Breadcrumb';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import BtnExport from 'src/components/Button/BtnExport';
import CONSTANTS from 'src/constants';
const { Text } = Typography;

const { Search } = Input;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function mapStateToProps(state) {
	return {
		store: {
			restaurant: state.restaurant.list,
			refund: state.refund.message,
			searchList: state.restaurant.searchList
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListRestaurant,
				refundRestaurant,
				getSearchListRestaurantRequest
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
@Form.create()
export default class CreditsRefund extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			restaurant: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListRestaurant: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		visible: false,
		confirmLoading: false,
		totalBalances: 0,
		selectedRows: [],
		amountRefund: 0,
		restaurantData: [],
		restaurantDataSearch: [],
		searchValue: false,
		searchString: ''
	};

	componentDidMount() {
		this.props.action.getListRestaurant(
			{
				pagination: false
			},
			() => {
				this.setState({ loading: false, restaurantData: this.props.store.restaurant.data });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	}

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = () => {
		const { selectedRows } = this.state;
		const idUser = [];
		if (selectedRows && selectedRows.length > 0) {
			selectedRows.forEach((item, index) => {
				idUser.push(item.user.id);

				// if (item.balance >= this.state.amountRefund && this.state.amountRefund > 0) {
				// 	this.handleActionRefund(idUser, this.state.amountRefund);
				// } else {
				// 	alert('Please check balance and the amount for refunding!');
				// }
			});
		}
		const note1 = this.state.noteMain ? this.state.noteMain : null;
		const note2 = this.state.noteSub ? this.state.noteSub : null;
		this.handleActionRefund(idUser, this.state.amountRefund, note1, note2);
		this.setState({
			ModalText: <FormattedMessage id="modalOK" defaultMessage="The modal will be closed after two seconds" />,
			confirmLoading: true
		});
		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false,
				totalBalances: 0
			});
		}, 2000);
	};

	handleActionRefund = (id, amount, noteMain, noteSub) => {
		const listID = id;
		const payload = {
			listID,
			amount,
			noteMain,
			noteSub
		};

		this.props.action.refundRestaurant(
			payload,
			res => {
				if (res.statusCode === 200) {
					if (this.state.searchValue === true) {
						this.handleSearch(this.state.searchString);
					} else {
						this.getListRestaurant();
					}
					message.success(<FormattedMessage id="refundSuccess" defaultMessage="Refund is successful !" />);
					this.setState({ loading: false });
				} else {
					message.error(res.message);
				}
			},
			() => {
				//
				this.setState({ loading: false });
			}
		);
	};
	getListRestaurant = () => {
		this.props.action.getListRestaurant(
			{ pagination: false },
			() => {
				this.setState({ loading: false, restaurantData: this.props.store.restaurant.data });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};
	handleCancel = () => {
		this.setState({
			visible: false,
			totalBalances: 0
		});
	};

	validateWithCurrentBalances = (rule, value, callback) => {
		if (value % 1 !== 0) {
			callback(`* S'il vous plaît entrer entier uniquement`);
		} else {
			let totalBalances = value * this.state.selectedRows.length;
			this.setState({ totalBalances, amountRefund: value });
		}
	};

	setSelected = selectedRows => {
		this.setState({ selectedRows });
	};

	handleSearch = searchStr => {
		const payload = { query: searchStr };
		this.props.action.getSearchListRestaurantRequest(
			payload,
			() => {
				this.setState({
					searchValue: true,
					searchString: searchStr,
					loading: false,
					restaurantData: this.props.store.searchList.data
				});
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	clearSearch = searchString => {
		if (searchString.length > 0) return;
		else {
			this.props.action.getListRestaurant(
				{
					pagination: false
				},
				() => {
					this.setState({ loading: false, restaurantData: this.props.store.restaurant.data });
				},
				() => {
					this.setState({ loading: false });
				}
			);
		}
	};

	render() {
		const {
			classes,
			store: { restaurant = {} }
		} = this.props;
		const { loading, selectedRowKeys } = this.state;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		};
		getFieldDecorator('keys', { initialValue: [] });

		const routes = [
			{
				breadcrumbName: <FormattedMessage id="breadcrumb.creditsRefund" defaultMessage="Credits refund" />
			}
		];
		const menu = (
			<Menu>
				{/* <Menu.Item
					key="refund-restaurant-more-refund"
					onClick={this.showModal}
					disabled={this.state.selectedRows.length === 0}>
					<Button
						onClick={this.showModal}
						className="ant-btn ant-btn-link"
						disabled={this.state.selectedRows.length === 0}>
						<Icon type="carry-out" />
						<FormattedMessage id="nav.credits.refund" defaultMessage="Refund" />
					</Button>
				</Menu.Item> */}
				{/* <Menu.Item key="refund-restaurant-more-refund-by-csv">
					<Button className="ant-btn ant-btn-link">
						<Icon type="import" rotate="-90" />
						<FormattedMessage id="refundByCSV" defaultMessage="Refund by CSV" />
					</Button>
				</Menu.Item> */}
				{/* <Menu.Item key="refund-restaurant-more-download">
					<Button className="ant-btn ant-btn-link">
						<Icon type="download" />
						<FormattedMessage id="download" defaultMessage="Download sample file" />
					</Button>
				</Menu.Item> */}
				<Menu.Item key="refund-restaurant-more-export">
					<BtnExport
						data={restaurant.data}
						textBtn={
							<>
								<Icon type="export" />
								<FormattedMessage id="export" defaultMessage="Export" />
							</>
						}
						filename="refund-list.csv"
					/>
				</Menu.Item>
			</Menu>
		);
		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					//  title="ss"
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
						<Col span={14} md={12}>
							{/* <HeaderContent name={'Refund restaurants'} /> */}
							<h3>
								<strong>
									<FormattedMessage id="refundRestaurants" defaultMessage="Refund restaurants" />
								</strong>
							</h3>
						</Col>
						<Col span={10} md={12}>
							<Row type="flex" justify="end" align="middle">
								<Col>
									<Search
										placeholder="Rechercher dans tous les domaines"
										className={classes.btnSearch}
										onSearch={value => this.handleSearch(value)}
										onChange={e => this.clearSearch(e.target.value)}
									/>
								</Col>
								<Col>
									<Button
										onClick={this.showModal}
										className="ant-btn ant-btn-link"
										disabled={this.state.selectedRows.length === 0}>
										<Icon type="carry-out" />
										<FormattedMessage id="nav.credits.refund" defaultMessage="Refund" />
									</Button>
								</Col>
								<Col>
									<Dropdown
										className={classes.moreOptions}
										trigger={['click']}
										overlay={menu}
										placement="bottomRight">
										<Icon type="more" />
									</Dropdown>
								</Col>
							</Row>
						</Col>
					</Row>
					<Modal
						destroyOnClose={true}
						title={<FormattedMessage id="refundRestaurant" defaultMessage="Refund restaurant" />}
						visible={this.state.visible}
						onOk={this.handleOk}
						confirmLoading={this.state.confirmLoading}
						onCancel={this.handleCancel}
						footer={[
							<Button key="back" onClick={this.handleCancel}>
								<FormattedMessage id="cancel" defaultMessage="Cancel" />
							</Button>,
							<Button key="affect" type="primary" loading={this.state.loading} onClick={this.handleOk}>
								<FormattedMessage id="nav.credits.refund" defaultMessage="Refund" />
							</Button>
						]}>
						<Form onSubmit={this.handleSubmit}>
							<Form.Item
								label={
									<FormattedMessage
										id="amountEachRestaurant"
										defaultMessage="Amount of each restaurant"
									/>
								}>
								{getFieldDecorator('refund', {
									rules: [
										{
											validator: this.validateWithCurrentBalances
										}
									]
								})(
									<NumericInput
										negative={false}
										float={false}
										onChange={value => {
											this.setState({ amountRefund: value });
										}}
									/>
								)}
							</Form.Item>
							<Text>
								<FormattedMessage id="employees.totalBalance" defaultMessage="Total balances" />:{' '}
								{numberWithSpaces(this.state.totalBalances)} {CONSTANTS.CURRENCY}
							</Text>
							<Form.Item className={classes.inputNote}>
								<Input.Group compact>
									<Input
										className={classes.inputGroup}
										placeholder="Note 1"
										onChange={value => {
											this.setState({ noteMain: value.target.value });
										}}
									/>
									<Input
										className={classes.inputGroup}
										placeholder="Note 2"
										onChange={value => {
											this.setState({ noteSub: value.target.value });
										}}
									/>
								</Input.Group>
							</Form.Item>
						</Form>
					</Modal>
					<Row className={classes.main}>
						<Spin spinning={loading}>
							<TableRefundRestaurant
								selectedRows={this.state.selectedRows}
								setSelected={this.setSelected}
								data={this.state.restaurantData}
							/>
						</Spin>
					</Row>
				</Card>
			</>
		);
	}
}
