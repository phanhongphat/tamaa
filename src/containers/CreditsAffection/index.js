import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Input, Card, Icon, Menu, Dropdown, Spin, Row, Col, Modal, Form, Button, Typography, message } from 'antd';
import { getListCompanies, getSearchListCompanieInfo } from 'src/redux/actions/companies';
import { affectCredit } from 'src/redux/actions/affectCredit';
import Breadcrumb from 'src/components/Breadcrumb';
import HeaderContent from 'src/components/HeaderContent';
import TableAffectCompanies from 'src/containers/CreditsAffection/Table';
import styles from './styles';
import CONSTANTS from 'src/constants';
import AuthStorage from '../../utils/AuthStorage';
import { Router } from '../../routes';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import BtnExport from 'src/components/Button/BtnExport';
import NumericInput from 'src/components/Input/NumericInput';
const { Text, Title } = Typography;
const { Search } = Input;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function mapStateToProps(state) {
	return {
		store: {
			companies: state.companies.list,
			message: state.message
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListCompanies,
				affectCredit,
				getSearchListCompanieInfo
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
export default class CreditsAffectionEmployee extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			companies: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListCompanies: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		selectedRows: [],
		visible: false,
		confirmLoading: false,
		currentBalances: 150000,
		balance: 0,
		totalBalances: 0,
		errorBalances: false,
		companyData: [],
		companyDataSearch: [],
		searchValue: false,
		searchString: '',
		noteMain: null,
		noteSub: null
	};

	componentDidMount() {
		this.props.action.getListCompanies(
			{ pagination: false },
			next => {
				// console.log(next);
				this.setState({ companyData: next, loading: false });
			},
			() => this.setState({ loading: false })
		);
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				this.setState({
					loading: true
				});
				this.props.action.loginRequest(
					values,
					() => {
						// console.log('this.props.auth', this.props.store.auth);
						// console.log('AuthStorage.loggedIn', AuthStorage.loggedIn);
						// if (AuthStorage.loggedIn && this.props.auth.userId) {
						if (AuthStorage.loggedIn) {
							Router.pushRoute('/');
						}

						this.setState({
							loading: false
						});
					},
					() => {
						this.setState({
							loading: false
						});
					}
				);
			}
		});
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = () => {
		const { selectedRows } = this.state;
		const idUser = [];
		if (this.state.searchValue === false) {
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
		} else {
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
		}
		const payload = {
			listID: idUser,
			amount: this.state.balance,
			noteMain: this.state.noteMain ? this.state.noteMain : null,
			noteSub: this.state.noteSub ? this.state.noteSub : null
		};
		// console.log(payload);
		// return;
		this.props.action.affectCredit(
			payload,
			next => {
				if (next.statusCode === 200 || next.statusCode === 200) {
					if (this.state.searchValue === true) {
						this.handleSearch(this.state.searchString);
						message.success(next.message);
					} else {
						this.setState({ loading: false });
						message.success(next.message);
						this.props.action.getListCompanies(
							{ pagination: false },
							next => {
								console.log(next);
								this.setState({ companyData: next, loading: false });
							},
							() => this.setState({ loading: false })
						);
					}
				} else {
					this.setState({ loading: false });
					message.error(next.message);
				}
			},
			() => this.setState({ loading: false })
		);

		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false,
				totalBalances: 0
			});
		}, 2000);
	};

	handleCancel = () => {
		console.log('Clicked cancel button');
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
			this.setState({ totalBalances, balance: value });
		}
	};

	setSelected = selectedRows => {
		this.setState({ selectedRows });
	};

	handleSearch(searchString) {
		const payload = { query: searchString };
		this.props.action.getSearchListCompanieInfo(
			payload,
			res => {
				if (res.statusCode === 404) {
					this.setState({
						loading: false,
						searchValue: true,
						companyData: [],
						searchString: searchString
					});
				} else {
					this.setState({
						loading: false,
						searchValue: true,
						companyData: res,
						searchString: searchString
					});
				}
			},
			() => this.setState({ loading: false })
		);
	}

	clearSearch = searchString => {
		if (searchString.length > 0) return;
		else {
			this.props.action.getListCompanies(
				{ pagination: false },
				next => {
					console.log(next);
					this.setState({ companyData: next, loading: false });
				},
				() => this.setState({ loading: false })
			);
		}
	};

	render() {
		const {
			classes,
			store: { companies = {} }
		} = this.props;
		const { loading } = this.state;
		const { getFieldDecorator } = this.props.form;
		getFieldDecorator('keys', { initialValue: [] });
		// console.log(this.state.companyDataSearch);
		const menu = (
			<Menu>
				{/* <Menu.Item
					key="affection-employee-more-affect"
					onClick={this.showModal}
					disabled={this.state.selectedRows.length === 0}>
					<Button
						onClick={this.showModal}
						className="ant-btn ant-btn-link"
						disabled={this.state.selectedRows.length === 0}>
						<Icon type="dollar" />
						<FormattedMessage id="affect" defaultMessage="Affect" />
					</Button>
				</Menu.Item> */}
				{/* <Menu.Item key="affection-employee-more-affect-by-csv">
					<Button className="ant-btn ant-btn-link">
						<Icon type="import" />
						<FormattedMessage id="affectByCSV" defaultMessage="Affect by CSV" />
					</Button>
				</Menu.Item> */}
				<Menu.Item key="affection-employee-more-download">
					<Button className="ant-btn ant-btn-link">
						<Icon type="download" />
						<FormattedMessage id="download" defaultMessage="Download sample file" />
					</Button>
				</Menu.Item>
				<Menu.Item key="affection-employee-more-export">
					<BtnExport
						data={this.state.companyData}
						textBtn={
							<>
								<Icon type="export" />
								<FormattedMessage id="export" defaultMessage="Export" />
							</>
						}
						filename="affection-list.csv"
					/>
				</Menu.Item>
			</Menu>
		);
		const routes = [
			{
				breadcrumbName: <FormattedMessage id="breadcrumb.creditsAffection" defaultMessage="Credits Affection" />
			}
		];
		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					//  title="ss"
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
						<Col span={14} md={12}>
							{/* <HeaderContent name={'Affect Companies'} /> */}
							<h3>
								<strong>
									<FormattedMessage id="companies.affect" defaultMessage="Affect Companies" />
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
										<Icon type="dollar" />
										<FormattedMessage id="affect" defaultMessage="Affect" />
									</Button>
								</Col>
								<Col>
									<Dropdown
										trigger={['click']}
										className={classes.moreOptions}
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
						title={<FormattedMessage id="credit.affectEmployee" defaultMessage="Affect Employees" />}
						visible={this.state.visible}
						onOk={this.handleOk}
						confirmLoading={this.state.confirmLoading}
						onCancel={this.handleCancel}
						footer={[
							<Button key="back" onClick={this.handleCancel}>
								<FormattedMessage id="cancel" defaultMessage="Cancel" />
							</Button>,
							<Button key="affect" type="primary" loading={this.state.loading} onClick={this.handleOk}>
								<FormattedMessage id="affect" defaultMessage="Affect" />
							</Button>
						]}>
						<Form onSubmit={this.handleSubmit}>
							<Form.Item
								label={
									<FormattedMessage
										id="amountEachEmployee"
										defaultMessage="Amount of each employee"
									/>
								}>
								{getFieldDecorator('affect', {
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
											this.setState({ balance: value });
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
									{getFieldDecorator('note1', {
										rules: []
									})(
										<Input
											onChange={e => this.setState({ noteMain: e.target.value })}
											className={classes.inputGroup}
											placeholder="Note 1"
										/>
									)}
									{getFieldDecorator('note2', {
										rules: []
									})(
										<Input
											onChange={e => this.setState({ noteSub: e.target.value })}
											className={classes.inputGroup}
											placeholder="Note 2"
										/>
									)}
								</Input.Group>
							</Form.Item>
						</Form>
					</Modal>
					<Row className={classes.main}>
						<Spin spinning={loading}>
							<TableAffectCompanies
								selectedRows={this.state.selectedRows}
								setSelected={this.setSelected}
								data={this.state.companyData}
							/>
						</Spin>
					</Row>
				</Card>
			</>
		);
	}
}
