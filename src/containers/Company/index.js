import React, { PureComponent } from 'react';
import Table from './Table';
import {
	Input,
	Icon,
	Menu,
	Dropdown,
	Button,
	Row,
	Col,
	Modal,
	Card,
	Form,
	Typography,
	message,
	Spin,
	Upload
} from 'antd';

const { Text } = Typography;
const { Search } = Input;

import { datas } from './datas.js';

import { Router } from 'src/routes';
import Breadcrumb from 'src/components/Breadcrumb';
import BtnExport from 'src/components/Button/BtnExport';
import ExportButton from 'src/components/Button/BtnUrlExport';
import NumberInput from 'src/components/Validate/NumberInput';
import SampleButton, { _HeaderText } from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';

import { getListCompanies, getSearchCompanieInfo } from 'src/redux/actions/companies.js';
import { exportCompany } from 'src/redux/actions/export.js';
import { deactiveMultipleUser } from 'src/redux/actions/user';
import { affectCredit } from 'src/redux/actions/affectCredit.js';
import { importByCSV } from 'src/redux/actions/importByCSV';
import injectSheet from 'react-jss';
import styles from './styles';
import CONSTANTS from 'src/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import ImportResultModal from 'src/components/Import/ImportResultModal';
import SampleTable from 'src/components/SampleTable';

const domain = process.env.API_URL.slice(0, process.env.API_URL.lastIndexOf('/'));

const { Dragger } = Upload;

const mapStateToProps = state => ({
	store: state
});

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			getListCompanies,
			getSearchCompanieInfo,
			affectCredit,
			deactiveMultipleUser,
			exportCompany,
			importByCSV
		},
		dispatch
	)
});

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

message.config({
	maxCount: 1
});

let _searchString = '';
const routes = [
	{
		breadcrumbName: <FormattedMessage id="nav.companise" defaultMessage="Companies" />
	}
];
const MenuItem = props => {
	const { key, name, icon, type } = props;
	return (
		<Menu.Item key={key} style={{ padding: '5px 20px' }}>
			<Icon type={icon} />
			<Button type={type}>{name}</Button>
		</Menu.Item>
	);
};

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
@Form.create()
export default class CompanyContainer extends PureComponent {
	state = {
		email: '',
		datas,
		loading: true,
		selectedRows: [],
		visible: false,
		currentBalances: 150000,
		balance: 0,
		totalBalances: 0,
		companyData: [],
		noteMain: '',
		noteSub: '',
		status: undefined,
		resetRow: false,
		exportData: undefined,
		importVisible: false,
		uriExport: '/get-company-csv'
	};

	showModal = () => {
		this.setState({ visible: true });
	};

	handleOk = () => {
		const _id = [];
		let count = 0;
		this.state.selectedRows.map(row => {
			_id.push(row.userId);
			row.activated !== true ? count++ : null;
		});
		if (count > 0) {
			this.setState({
				status:
					"L'opération n'a pas pu aboutir car les comptes suivants sont désactivés ou les crédits sont inactifs"
			});
		} else if (!this.state.balance || this.state.balance <= 0) {
			count = 0;
			this.setState({ status: 'Valeur invalide' });
		} else if (isNaN(this.state.totalBalances) || this.state.totalBalances < 1) {
			this.setState({ status: `Le montant de l'opération doit être supérieur a 0.` });
		} else {
			const payload = {
				listID: _id,
				amount: this.state.balance,
				noteMain: this.state.noteMain ? this.state.noteMain : null,
				noteSub: this.state.noteSub ? this.state.noteSub : null
			};
			// console.log(payload);
			// return;
			this.setState({ loading: true, resetRow: true, selectedRows: [] });
			this.props.action.affectCredit(
				payload,
				() => {
					this.setState({
						balance: ''
					});
					message.success('Crédit envoyé avec succès');
					this.getSearchValue(_searchString);
				},
				() => this.setState({ loading: false })
			);
			setTimeout(() => {
				this.resetForm();
				this.setState({
					visible: false,
					resetRow: false
				});
			}, 2000);
		}
	};

	handleDownloadSampleFile = () => {
		const linkSource = domain + '/sample/import/company_sample_data.csv';
		const downloadLink = document.createElement('a');
		// const fileName = 'restaurants.pdf';

		downloadLink.href = linkSource;
		// downloadLink.download = fileName;
		downloadLink.click();
	};

	handleCancel = () => {
		this.setState({
			visible: false,
			status: '',
			importResultVisible: false,
			importVisible: false,
			fileList: []
		});
		this.resetForm();
	};

	getListCompany = () => {
		this.props.action.getListCompanies(
			{ pagination: false },
			() =>
				this.setState({
					loading: false,
					companyData: this.props.store.companies.list.data
				}),
			() => this.setState({ loading: false })
		);
	};

	onGetStateChange = (name, value) => {
		let totalBalances;
		name === 'balance' ? (totalBalances = value * this.state.selectedRows.length) : 0;
		this.setState({ [name]: value, totalBalances });
	};

	setSelected = selectedRows => {
		this.setState({ selectedRows });
	};

	renderUrlExport = () => {
		const { selectedRows, uriExport } = this.state;
		if (selectedRows && selectedRows.length > 0) {
			let uri = uriExport + '?';
			for (let i = 0; i < selectedRows.length; i++) {
				uri = uri + 'id[]=' + selectedRows[i].id + '/';
			}
			console.log('uriExport ====>', uriExport);
		}
	};

	componentDidMount() {
		this.getListCompany();
	}

	resetForm = () => {
		this.setState({
			balance: 0,
			totalBalances: 0,
			noteMain: '',
			noteSub: ''
		});
		this.props.form.setFieldsValue({
			balance: undefined,
			note1: undefined,
			note2: undefined
		});
	};

	getSearchValue = payload => {
		this.setState({ loading: true });
		this.props.action.getSearchCompanieInfo(
			payload,
			res => {
				// console.log(res);
				this.setState({ loading: false, companyData: res ? [...res] : [] });
			},
			() => this.setState({ loading: false })
		);
	};

	clearSearch = searchString => {
		if (searchString.length > 0) return;
		else {
			this.getSearchValue(' ');
			_searchString = '';
		}
	};

	handleSearch(searchString) {
		if (searchString === '') {
			message.error('Veuillez saisir des valeurs pour effectuer une recherche');
			return;
		} else if (_searchString === searchString) message.error('La valeur existe déjà');
		else {
			const payload = searchString;
			this.getSearchValue(payload);
			_searchString = searchString;
		}
	}

	handleImport = () => {
		const { fileList } = this.state;

		this.setState({
			loading: true
		});

		if (fileList.length) {
			const payload = {
				entity: 'company',
				files: fileList.map((each, index) => {
					return {
						field: 'file',
						file: each.originFileObj
					};
				})
			};
			// console.log('payload', payload);
			this.props.action.importByCSV(
				payload,
				next => {
					// console.log('next', next);
					this.handleCancel();
					this.setState({
						importResultVisible: true,
						importResult: next,
						loading: false
					});
					this.getListRestaurant();
				},
				nextErr => {
					this.setState({
						loading: false
					});
				}
			);
		} else {
			message.error('Do not have any file to import');
		}
	};

	// getExportData = data => {
	// 	console.log(data);
	// };

	render() {
		const {
			classes,
			store: { companies = {} }
		} = this.props;
		const { getFieldDecorator } = this.props.form;

		const { loading, fileList } = this.state;

		const menuMore = (
			<Menu>
				<Menu.Item key="restaurant-more-import" onClick={() => this.setState({ importVisible: true })}>
					<Icon type="import" />
					<Button type="link">
						<FormattedMessage id="import" defaultMessage="Import" />
					</Button>
				</Menu.Item>
				{/* <Menu.Item key="restaurant-more-download" onClick={() => this.handleDownloadSampleFile()}>
					<Icon type="download" />
					<Button type="link">
						<FormattedMessage id="download" defaultMessage="Download sample file" />
					</Button>
				</Menu.Item> */}
				<Menu.Item key="restaurant-more-export">
					<Icon type="export" />
					<ExportButton uri={this.state.uriExport} selectedRows={this.state.selectedRows} />
				</Menu.Item>
			</Menu>
		);

		const companyData = [];
		const filterData = [];
		this.state.companyData &&
			this.state.companyData
				.sort((a, b) => b.id - a.id)
				.map((data, index) => {
					filterData.push({ key: index, text: data.name, value: data.name });
					companyData.push({
						id: data.id,
						customId: data.user && data.user.customId,
						company: data.name,
						email: data.email,
						balance: data.balance,
						employeeBalance: data.employeesBalance,
						activated: data.user && data.user.activated,
						userId: data.user && data.user.id
					});
				});
		// console.log(companyData);

		return (
			<>
				<Breadcrumb breadcrumb={routes} />
				<Card className={classes.card} bordered={false}>
					<Row type="flex" justify="space-between">
						<_HeaderText name="Toutes les sociétés" />
						<Row type="flex" justify="end" align="middle">
							<Col>
								<Row type="flex" justify="center">
									<Search
										style={{ width: '100%' }}
										placeholder="Rechercher dans tous les champs"
										className={classes.btnSearch}
										onChange={e => this.clearSearch(e.target.value)}
										onSearch={value => this.handleSearch(value)}
									/>
								</Row>
							</Col>
							<Col className={classes.wrapperCreateNew}>
								<Row type="flex" justify="center">
									<SampleButton
										name="Ajouter une société"
										type="link"
										icon="plus"
										action={() => Router.pushRoute('/create-company')}
									/>
								</Row>
							</Col>
							<Col>
								<SampleButton
									name="Affecter"
									disabled={this.state.selectedRows.length === 0 ? true : false}
									type="link"
									icon="dollar"
									action={this.showModal}
								/>
							</Col>
							<Col>
								<Row type="flex" justify="center">
									<Dropdown overlay={menuMore} trigger={['click']}>
										<Button type="link" shape="circle" icon="more" />
									</Dropdown>
								</Row>
							</Col>
						</Row>
					</Row>

					<Row>
						<Spin spinning={loading}>
							{/* <Table
								setSelected={this.setSelected}
								datas={this.state.companyData}
								resetRow={this.state.resetRow}
							/> */}
							<SampleTable
								email={true}
								company={true}
								comBalance={true}
								empBalance={true}
								data={companyData}
								filterData={filterData}
								setSelected={this.setSelected}
								url="/company-detail/"
								resetRow={this.state.resetRow}
							/>
						</Spin>
					</Row>
					{/* Modal */}
					<Modal
						title="Affecter les sociétés"
						visible={this.state.visible}
						onCancel={this.handleCancel}
						footer={[
							<SampleButton name="Annuler" action={this.handleCancel} />,
							<SampleButton
								name="Affecter"
								action={this.handleOk}
								loading={this.state.loading}
								type="primary"
							/>
						]}>
						<Form>
							<NumberInput
								name="Montant Société"
								stateName="balance"
								form={this.props.form}
								onChange={this.onGetStateChange}
								status={this.state.status}
								value={this.state.balance}
							/>

							<Text>
								<FormattedMessage id="employees.totalBalance" defaultMessage="Total balances" />:{' '}
								{isNaN(this.state.totalBalances)
									? 0
									: numberWithSpaces(
											this.state.totalBalances < 0 ? 0 : this.state.totalBalances
									  )}{' '}
								{CONSTANTS.CURRENCY}
							</Text>
							<Form.Item className={classes.inputNote}>
								<Input.Group compact>
									{getFieldDecorator('note1', {})(
										<Input
											placeholder="Note 1"
											onChange={value => {
												this.setState({ noteMain: value.target.value });
											}}
										/>
									)}
									{getFieldDecorator('note2', {})(
										<Input
											style={{ marginTop: '10px' }}
											placeholder="Note 2"
											onChange={value => {
												this.setState({ noteSub: value.target.value });
											}}
										/>
									)}
								</Input.Group>
							</Form.Item>
						</Form>
					</Modal>
					<Modal
						title="Import restaurants"
						visible={this.state.importVisible}
						onOk={this.handleImport}
						okText="Import"
						confirmLoading={this.state.loading}
						onCancel={this.handleCancel}
						cancelText="Cancel">
						<Dragger
							name="file"
							// multiple={true}
							fileList={fileList}
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							beforeUpload={(file, FileList) => {
								const isCSV = !!file.name.match(/\.csv$/); // && file.type === 'text/csv';
								if (!isCSV) {
									message.error('You can only upload CSV file!');
								}
								const isLt2M = file.size / 1024 / 1024 < 10;
								if (!isLt2M) {
									message.error('File must smaller than 10MB!');
								}
								return isCSV && isLt2M;
							}}
							onChange={info => {
								const { status } = info.file;

								if (status === 'done') {
									message.success(`${info.file.name} file uploaded successfully.`);
								} else if (status === 'error') {
									message.error(`${info.file.name} file upload failed.`);
								}

								let fileList = [...info.fileList];

								fileList = fileList.filter(
									file => !!file.name.match(/\.csv$/) && file.size / 1024 / 1024 < 10
								);

								if (fileList.length > 1) {
									fileList = fileList.slice(-1);
								}

								this.setState({ fileList });
							}}>
							<p className="ant-upload-drag-icon">
								<Icon type="inbox" />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
							<p className="ant-upload-hint">
								Support for a single or bulk upload. Strictly prohibit from uploading company data or
								other band files
							</p>
						</Dragger>
					</Modal>
					<ImportResultModal
						importResultVisible={this.state.importResultVisible}
						importResult={this.state.importResult}
						handleCancel={this.handleCancel}
					/>
				</Card>
			</>
		);
	}
}
