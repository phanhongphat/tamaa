import React, { PureComponent } from 'react';
import EmployeeTable from './Table';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import { Spin, Card, Row, Col, Typography, Button, Icon, Dropdown, Menu, Modal, Input, Divider, message } from 'antd';

import { getListEmployees, searchEmployee } from 'src/redux/actions/employee.js';
import { affectCredit } from 'src/redux/actions/affectCredit.js';
import { getCompanieInfo } from 'src/redux/actions/companies';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CONSTANTS from 'src/constants';

import injectSheet from 'react-jss';
import styles from './styles';
import BtnExport from 'src/components/Button/BtnExport';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';
import SampleTable from 'src/components/SampleTable';

import { Router } from 'src/routes';

const { Title, Text } = Typography;
const { Search } = Input;
let _searchString = '';

const mapStateToProps = state => ({
	list: state.employees.list.data,
	details: state.companies.detail.data
});

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			getListEmployees,
			affectCredit,
			getCompanieInfo,
			searchEmployee
		},
		dispatch
	)
});

const MenuItem = props => {
	const { key, name, icon, type } = props;
	return (
		<Menu.Item key={key} style={{ padding: '5px 20px' }}>
			<Icon type={icon} />
			<Button type={type}>{name}</Button>
		</Menu.Item>
	);
};

function numberWithSpaces(x) {
	return x !== undefined && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
export default class _Employees extends PureComponent {
	state = {
		email: '',
		loading: true,
		selectedRows: [],
		visible: false,
		confirmLoading: false,
		currentBalances: 150000,
		balance: 0,
		totalBalances: 0,
		errorBalances: false,
		status: '',
		listEmployee: []
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = () => {
		const _id = [];
		let count = 0;
		this.state.selectedRows.map(row => {
			_id.push(Number(row.user.id));
			row.user.activated !== true || row.user.creditActivated !== true ? count++ : null;
		});
		const payload = {
			listID: _id,
			amount: this.state.balance,
			noteMain: this.state.noteMain ? this.state.noteMain : null,
			noteSub: this.state.noteSub ? this.state.noteSub : null
		};

		if (this.state.totalBalances > this.props.details.balance) {
			this.setState({ status: 'Solde insuffisant.' });
		} else if (isNaN(this.state.totalBalances) || this.state.totalBalances < 1) {
			this.setState({ status: `Le montant de l'opération doit être supérieur à 0.` });
		} else if (count > 0) {
			this.setState({
				status:
					"L'opération n'a pas pu aboutir car les comptes suivants sont désactivés ou les crédits sont inactifs"
			});
		} else {
			this.setState({ loading: true, resetRow: true, selectedRows: [] });
			this.props.action.affectCredit(
				payload,
				() => {
					this.setState({ status: '', visible: false });
					this.getEmployees();
					this.getCompany();
				},
				() => this.setState({ loading: false })
			);
			setTimeout(() => {
				this.setState({
					resetRow: false
				});
			}, 2000);
		}
	};

	handleCancel = () => {
		this.setState({
			visible: false,
			totalBalances: 0,
			balance: 0
		});
	};

	validateWithCurrentBalances = value => {
		let totalBalances = value * this.state.selectedRows.length;
		this.setState({ totalBalances, balance: value });
	};

	menuMore = id => (
		<Menu>
			<MenuItem key="restaurant-more-import" icon="import" name="Importer" type="link" />
			<MenuItem key="restaurant-more-download" icon="download" name="Télécharger un fichier modèle" type="link" />
			<MenuItem key="restaurant-more-export" icon="export" name="Exporter" type="link" />
		</Menu>
	);

	setSelected = selectedRows => {
		this.setState({ selectedRows });
	};

	getEmployees = () => {
		this.props.action.getListEmployees(
			{ company: this.props.id },
			res =>
				this.setState({
					loading: false,
					status: '',
					totalBalances: 0,
					balance: 0,
					noteMain: '',
					noteSub: '',
					listEmployee: res
				}),
			() => this.setState({ loading: false })
		);
	};

	getCompany = () => {
		this.props.action.getCompanieInfo(
			{ id: this.props.id },
			() =>
				this.setState({
					loading: false
				}),
			() => this.setState({ loading: false })
		);
	};

	componentDidMount() {
		this.getEmployees();
		this.getCompany();
	}

	clearSearch = e => {
		if (e.target.value.length > 0) return;
		else {
			this.getEmployees();
			_searchString = '';
			this.setState({ listEmployee: this.props.list });
		}
	};

	getSearchValue = payload => {
		this.props.action.searchEmployee(
			payload,
			res => this.setState({ loading: false, listEmployee: res }),
			() => this.setState({ loading: false })
		);
	};

	handleSearch = e => {
		if (e === '') {
			message.error('Veuillez saisir des valeurs pour effectuer une recherche');
			return;
		} else if (e === _searchString) message.error('La valeur existe déjà');
		else {
			const payload = {
				params: {
					query: e,
					company_Id: this.props.id
				}
			};
			this.getSearchValue(payload);
			_searchString = e;
		}
	};

	render() {
		const { balance } = this.props.details;
		const { classes } = this.props;
		const { loading, selectedRows } = this.state;

		console.log(this.state.listEmployee);
		const employeeData = [];
		const filterData = [];
		this.state.listEmployee &&
			this.state.listEmployee
				.sort((a, b) => b.id - a.id)
				.map((data, index) => {
					// filterData.push({
					// 	key: index,
					// 	text: data.firstName + data.lastName,
					// 	value: data.firstName + data.lastName
					// });
					employeeData.push({
						id: data.id,
						customId: data.user && data.user.customId,
						activated: data.user && data.user.activated,
						employeeName: `${data.firstName} ${data.lastName}`,
						phoneNumber: data.phoneNumber,
						email: data.email,
						balance: data.balance
					});
				});
		// console.log(filterData);
		return (
			<Card style={{ minHeight: 360 }} bordered={false}>
				<Row type="flex" justify="space-between">
					<Title level={4}>
						<FormattedMessage id="allEmployees" defaultMessage="All Employees" />
					</Title>
					<Row type="flex" justify="end" align="middle">
						<Col>
							<Row type="flex" justify="center">
								<Search
									style={{ width: '100%' }}
									placeholder="Rechercher dans tous les champs"
									className={classes.btnSearch}
									onChange={this.clearSearch}
									onSearch={this.handleSearch}
								/>
							</Row>
						</Col>
						<Col className={classes.wrapperCreateNew}>
							<Row type="flex" justify="center">
								<SampleButton
									name="Ajouter un employé"
									action={() => Router.pushRoute(`/create-employee/${this.props.id}`)}
									icon="plus"
									type="link"
								/>
							</Row>
						</Col>
						<Col>
							<SampleButton
								name="Affecter"
								icon="dollar"
								type="link"
								action={this.showModal}
								disabled={this.state.selectedRows.length === 0}
							/>
						</Col>
						<Col>
							<Row type="flex" justify="center">
								<Dropdown overlay={this.menuMore} trigger={['click']}>
									<Button type="link" shape="circle" icon="more" />
								</Dropdown>
							</Row>
						</Col>
					</Row>
				</Row>

				<Spin spinning={loading}>
					<EmployeeTable
						// data={employeeList ? employeeList : []}
						data={this.state.listEmployee ? this.state.listEmployee : []}
						setSelected={this.setSelected}
						resetRow={this.state.resetRow}
					/>
					{/* <SampleTable
						email={true}
						phone={true}
						employeeName={true}
						data={employeeData}
						filterData={filterData}
						resetRow={this.state.resetRow}
					/> */}
				</Spin>

				<Modal
					title={<FormattedMessage id="companies.affect" defaultMessage="Affect Companies" />}
					visible={this.state.visible}
					closable={false}
					footer={
						<Button.Group>
							<SampleButton name="Annuler" action={this.handleCancel} />{' '}
							<SampleButton
								name="Affecter"
								action={this.handleOk}
								loading={this.state.loading}
								type="primary"
							/>
						</Button.Group>
					}>
					<Card>
						<Row gutter={16} type="flex" align="middle">
							<Col span={12}>
								<b>Solde</b>
								<Row type="flex">
									<Title level={3} className={classes.balance}>
										{numberWithSpaces(balance)}
									</Title>
									<span className={classes.balanceCurrency}>{CONSTANTS.CURRENCY}</span>
								</Row>
							</Col>
							<Col span={12}>
								Solde total
								<Row type="flex" justify="end">
									<Title level={3} className={classes.balance}>
										<Input
											value={this.state.balance === 0 ? null : this.state.balance}
											size="large"
											suffix={
												<span className={classes.balanceCurrency}>{CONSTANTS.CURRENCY}</span>
											}
											placeholder={numberWithSpaces(
												parseInt(balance / this.state.selectedRows.length)
											)}
											onChange={event => {
												let value = event.target.value;
												let totalBalances = value * this.state.selectedRows.length;
												if (!value) this.setState({ status: '' });
												this.setState({ totalBalances, balance: value });
											}}
										/>
									</Title>
									<Text style={{ color: 'red' }}>{this.state.status}</Text>
								</Row>
							</Col>
						</Row>

						<Row gutter={16} type="flex" align="middle">
							<Col span={12}>
								<b>
									<FormattedMessage id="total" defaultMessage="Total" />
								</b>
							</Col>
							<Col span={12}>
								<Row type="flex" className={classes.balanceBoxer}>
									<Title level={3} className={classes.balance}>
										{isNaN(this.state.totalBalances)
											? 0
											: numberWithSpaces(this.state.totalBalances)}
									</Title>
									<span className={classes.balanceCurrency}>{CONSTANTS.CURRENCY}</span>
								</Row>
							</Col>
						</Row>
					</Card>
					<Input
						className={classes.noteInput}
						placeholder="Note 1"
						value={this.state.noteMain}
						onChange={value => {
							this.setState({ noteMain: value.target.value });
						}}
					/>
					<Input
						className={classes.noteInput}
						placeholder="Note 2"
						value={this.state.noteSub}
						onChange={value => {
							this.setState({ noteSub: value.target.value });
						}}
					/>
				</Modal>
			</Card>
		);
	}
}

//167
//615
