import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
// import { Router, Link } from 'src/routes';
import { Button, Menu, Row, Col, Input, Icon, Dropdown, Spin, Modal, Upload, Card, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import ImportResultModal from 'src/components/Import/ImportResultModal';
import { importByCSV } from 'src/redux/actions/importByCSV';
const { Search } = Input;
const { confirm } = Modal;
const { Dragger } = Upload;

import styles from './styles';

// import Title from './UsersComponent/Title';
import BtnExport from 'src/components/Button/BtnExport';
import Breadcrumb from 'src/components/Breadcrumb';
import BtnCreateUser from 'src/components/Button/CreateUser';
import Table from './Table';
import dataSample from './Table/dataSample';

//redux
import { getListUser, deleteUser, deactiveMultipleUser } from 'src/redux/actions/user';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			users: state.user.list
		}
	};
}
const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListUser,
				deleteUser,
				deactiveMultipleUser,
				importByCSV
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
export default class SettingUsersContainer extends PureComponent {
	state = {
		loading: true,
		selectedRows: [],
		importResultVisible: false,
		importVisible: false,
		fileList: []
	};

	filter = {
		// email: '',
		// username: '',
		// _page: '1',
		// itemsPerPage: 10,
		pagination: false,
		roles: '["ROLE_TAMAA"]'
	};

	componentDidMount() {
		this.getListUser();
	}

	getListUser = filter => {
		this.setState({ loading: true });
		const params = filter ? filter : this.filter;
		this.props.action.getListUser(
			params,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	onSelectChange = selectedRows => {
		// console.log('selectedRows', selectedRows);
		this.setState({ selectedRows });
	};

	handleCancel = () => {
		this.setState({
			importResultVisible: false,
			importVisible: false,
			fileList: []
		});
	};

	// showConfirmDeleteById = () => {
	// 	const seft = this;
	// 	const { selectedRowKeys } = this.state;
	// 	if (selectedRowKeys.length > 0) {
	// 		confirm({
	// 			title: 'Confirmez-vous la supprimé des éléments sélectionnés?',
	// 			content: 'Lorsque vous cliquez sur le bouton OK, cette boîte de dialogue sera fermée après 1 seconde',
	// 			onOk() {
	// 				seft.handelDeleteById();
	// 			},
	// 			onCancel() {}
	// 		});
	// 	}
	// };
	//
	// handelDeleteById = () => {
	// 	const { selectedRowKeys } = this.state;
	// 	console.log('handelDeleteById', selectedRowKeys);
	// 	const payload = {
	// 		id: selectedRowKeys[0]
	// 	};
	//
	// 	this.props.action.deleteUser(
	// 		payload,
	// 		() => {
	// 			this.getListUser();
	// 			this.setState({ loading: false });
	// 		},
	// 		() => {
	// 			this.setState({ loading: false });
	// 		}
	// 	);
	// };

	handleActivate() {
		const rows = this.state.selectedRows;
		// console.log('rows selectedRows', rows);
		const payload = rows.map(each => {
			console.log(each);
			return {
				id: each.id,
				activated: true,
				creditActivated: true
			};
		});
		this.props.action.deactiveMultipleUser(
			payload,
			() => {
				this.setState({ loading: false });
				message.success(`Activated ${rows.length} users`);
			},
			() => this.setState({ loading: false })
		);
		setTimeout(() => {
			this.getListUser();
			// this.setState({ companyData: this.props.store.companies.list.data });
		}, 2500);
	}

	handleDeactivate() {
		const rows = this.state.selectedRows;
		// console.log('rows selectedRows', rows);
		const payload = rows.map(each => {
			console.log(each);
			return {
				id: each.id,
				activated: false,
				creditActivated: false
			};
		});
		this.props.action.deactiveMultipleUser(
			payload,
			() => {
				this.setState({ loading: false });
				message.success(`Deactivated ${rows.length} users`);
			},
			() => this.setState({ loading: false })
		);
		setTimeout(() => {
			this.getListUser();
		}, 2500);
	}

	handleImport = () => {
		const { fileList } = this.state;

		this.setState({
			loading: true
		});

		if (fileList.length) {
			const payload = {
				entity: 'user',
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
					this.getListUser();
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

	render() {
		const {
			classes,
			store: {
				users: { data = [] }
			}
		} = this.props;

		const { loading, fileList } = this.state;

		const openModalImportCSV = () => {
			this.setState({ importVisible: true });
		};

		const menu = (
			<Menu>
				<Menu.Item
					key="restaurant-more-active"
					disabled={this.state.selectedRows.length === 0}
					onClick={() => {
						const seft = this;
						confirm({
							title: (
								<FormattedMessage
									id="message.activate"
									defaultMessage="Confirmez-vous la activation des éléments sélectionnés?"
								/>
							),
							onOk() {
								seft.handleActivate();
							},
							onCancel() {}
						});
					}}>
					<Icon type="check-circle" />
					<Button type="link" disabled={this.state.selectedRows.length === 0}>
						<FormattedMessage id="user.option.active" defaultMessage="Activate" />
					</Button>
				</Menu.Item>
				<Menu.Item
					key="restaurant-more-deactive"
					disabled={this.state.selectedRows.length === 0}
					onClick={() => {
						const seft = this;
						confirm({
							title: (
								<FormattedMessage
									id="message.activate"
									defaultMessage="Confirmez-vous la activation des éléments sélectionnés?"
								/>
							),
							onOk() {
								seft.handleDeactivate();
							},
							onCancel() {}
						});
					}}>
					<Icon type="close-circle" />
					<Button type="link" disabled={this.state.selectedRows.length === 0}>
						<FormattedMessage id="user.option.deactive" defaultMessage="Deactivate" />
					</Button>
				</Menu.Item>
				<Menu.Item key="restaurant-more-import" onClick={() => openModalImportCSV()}>
					<Icon type="import" />
					<Button type="link">
						<FormattedMessage id="user.option.import" defaultMessage="Import" />
					</Button>
				</Menu.Item>
				<Menu.Item key="restaurant-more-download">
					<Icon type="download" />
					<BtnExport
						data={dataSample}
						textBtn="Télécharger une exemple de fichier"
						filename="user_sample.csv"
					/>
				</Menu.Item>
				<Menu.Item key="restaurant-more-export">
					<Icon type="export" />
					<BtnExport data={data} textBtn="Exporter" filename="user.csv" />
				</Menu.Item>
			</Menu>
		);

		const routes = [
			{
				breadcrumbName: <FormattedMessage id="user.breadcrum.setting" defaultMessage="Setting" />
			},
			{
				breadcrumbName: <FormattedMessage id="user.breadcrum.user" defaultMessage="Users" />
			}
		];

		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					// title={<FormattedMessage id="user.breadcrum.title.user" defaultMessage="Users" />}
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Row type="flex" align="middle" justify="space-between">
						<Col span={10} md={16}>
							<h3>
								<strong>
									<FormattedMessage id="user.header" defaultMessage="Users" />
								</strong>
							</h3>
						</Col>
						<Col span={14} md={8}>
							<Row type="flex" justify="end" align="middle">
								{/* <Col>
									<Search
										placeholder="Search in all fields"
										className={classes.btnSearch}
										onSearch={value => console.log(value)}
									/>
								</Col> */}
								<Col>
									<BtnCreateUser getListUser={this.getListUser} />
								</Col>
								<Col>
									<Dropdown overlay={menu} trigger="click ">
										<Button type="link" icon="more" />
									</Dropdown>
								</Col>
							</Row>
						</Col>
					</Row>

					<Row>
						<Spin spinning={loading}>
							<Table data={data} onSelectChange={this.onSelectChange} />
						</Spin>
					</Row>
				</Card>
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
							Support for a single or bulk upload. Strictly prohibit from uploading company data or other
							band files
						</p>
					</Dragger>
				</Modal>
				<ImportResultModal
					importResultVisible={this.state.importResultVisible}
					importResult={this.state.importResult}
					handleCancel={this.handleCancel}
				/>
			</>
		);
	}
}
