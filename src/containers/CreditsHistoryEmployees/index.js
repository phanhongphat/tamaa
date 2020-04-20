import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import { getListTransactions, filterTransactions, getCreditsByUserId } from 'src/redux/actions/transactions';
import injectSheet from 'react-jss';
import {
	Input,
	Icon,
	Menu,
	Dropdown,
	Button,
	message,
	Tabs,
	DatePicker,
	Divider,
	Row,
	Form,
	Typography,
	Select,
	Spin,
	Tag,
	Avatar,
	Col,
	Card
} from 'antd';
import Breadcrumb from 'src/components/Breadcrumb';
import CreditsHistoryEmployeesTable from 'src/containers/CreditsHistoryEmployees/Table';
import styles from './styles';
import HeaderContent from 'src/components/HeaderContent';
import AuthStorage from 'src/utils/AuthStorage';
import moment from 'moment';
import BtnExport from 'src/components/Button/BtnExport';
const { RangePicker } = DatePicker;

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { Text, Titile } = Typography;

function mapStateToProps(state) {
	return {
		store: {
			transactions: state.transactions.list,
			credits: state.transactions.listCredits
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListTransactions,
				filterTransactions,
				getCreditsByUserId
			},
			dispatch
		)
	};
};

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
};

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class CreditsHistoryContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			credit: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	state = {
		loading: true,
		visible: false,
		companySelected: null
	};

	// content = (
	// 	<Form {...formItemLayout}>
	// 		<Form.Item
	// 			key="filterCompany"
	// 			label={<FormattedMessage id="byCompany" defaultMessage="By company" />}
	// 			labelAlign="left">
	// 			<Select onChange={selected => this.onChangeSelectCompany(selected)} placeholder="Select company">
	// 				{companies.map(each => {
	// 					return <Option value={each.id}>{each.name}</Option>;
	// 				})}
	// 			</Select>
	// 		</Form.Item>
	// 	</Form>
	// );

	componentDidMount() {
		this.rerender();
	}

	rerender = () => {
        const { isTama, isCompany, isRestaurant, idInfo, userId, email } = AuthStorage;
        let payload = {};
        if (isTama) {
            payload = {
                'creditor.roles': '[\"ROLE_EMPLOYEE\"]',
                'debitor.roles': '[\"ROLE_TAMAA\"]',
                // 'type': '/api/transactions_types/2',
                pagination: false
            };
            this.props.action.filterTransactions(
                payload,
                () => this.setState({ loading: false }),
                () => this.setState({ loading: false })
            );
        } else if (isCompany) {
            payload = {
                'company_Id': `${idInfo}`,
                'tamaa': true,
                'type[]': 'AFFECTION',
                // 'creditor.roles': '[\"ROLE_EMPLOYEE\"]',
                // 'debitor.roles': '[\"ROLE_TAMAA\"]',
                // 'type': '/api/transactions_types/2',
                pagination: false,
            };
            this.props.action.getCreditsByUserId(
                payload,
                () => this.setState({ loading: false }),
                () => this.setState({ loading: false })
            );
        }
	};

	handleFilterDatesTransactions = (e, dataString) => {
		const { isTama, isCompany, isRestaurant, idInfo, userId, email } = AuthStorage;
		let payload = {};
		const temp1 = String(dataString[0]);
		const temp2 = String(dataString[1]);
		const date1 = moment(temp1, 'DD/MM/YYYY').format('YYYY-MM-DD 00:00:00');
		const date2 = moment(temp2, 'DD/MM/YYYY').format('YYYY-MM-DD 23:59:59');
        if (isTama) {
            payload = {
                'date[after]': date1,
                'date[before]': date2,
                'creditor.roles': '[\"ROLE_EMPLOYEE\"]',
                'debitor.roles': '[\"ROLE_TAMAA\"]',
                // 'type': '/api/transactions_types/2',
                pagination: false
            };
        } else if (isCompany) {
            payload = {
                'date[after]': date1,
                'date[before]': date2,
                'creditor.roles': '[\"ROLE_EMPLOYEE\"]',
                'debitor.roles': '[\"ROLE_TAMAA\"]',
                // 'type': '/api/transactions_types/2',
                pagination: false
            };
        }
		if (e[0] && e[1]) {
			this.props.action.filterTransactions(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		} else {
			this.rerender();
		}
	};
	onChangeSelectCompany = selected => {
		this.setState({
			companySelected: companies.find(inner => {
				return inner.id === selected;
			}).name
		});
	};

	render() {
		const {
			classes,
			store: { transactions = {}, credits = {} }
		} = this.props;

		const { loading } = this.state;
		const routes = [
			{
				breadcrumbName: 'Credit history'
			}
		];
		const { isTama, isCompany, isRestaurant, idInfo } = AuthStorage;
		let dataTransactions = isCompany ? [...credits.data] : [...transactions.data];
		// if (isTama) {
		// 	dataTransactions = [...transactions.data];
		// } else if (isCompany || isRestaurant) {
		// 	dataTransactions = [...transactions.data];
		// }
		return (
			<>
				<Breadcrumb breadcrumb={routes} />
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<div>
						{/* <HeaderContent name={'All credits'} /> */}
						<h3>
							<strong>
								<FormattedMessage id="allCredits" defaultMessage="All credits" />
							</strong>
						</h3>
					</div>
					<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
						{/* <Col>
							<Search
								placeholder="Search in all fields"
								className={classes.btnSearch}
								onSearch={value => console.log(value)}
							/>
						</Col> */}

						<Col>
							<RangePicker format="DD/MM/YYYY" onChange={this.handleFilterDatesTransactions} />
						</Col>

						<BtnExport
							data={transactions.data}
							textBtn={
								<Button className={classes.formButton} value="export" icon="export" type="link">
									<FormattedMessage id="export" defaultMessage="Export" />
								</Button>
							}
							filename="Credits-history.csv"
						/>
					</Row>
					{this.state.companySelected ? (
						<Row className={classes.headerBar} type="flex" align="middle">
							<FormattedMessage id="activateFilter" defaultMessage="Active filters" />:
							<div>
								<Tag className={classes.companyTag}>
									<Avatar className={classes.companyTagAvatar}>
										{this.state.companySelected ? this.state.companySelected[0] : ''}
									</Avatar>
									<Text className={classes.companyTagText}>{this.state.companySelected}</Text>
								</Tag>
							</div>
						</Row>
					) : (
						''
					)}
					<Spin spinning={loading}>
						<CreditsHistoryEmployeesTable role={'Tama'} data={dataTransactions} />
						{/*{(isCompany || isRestaurant) && <Table role={'Company'} data={dataTransactions} />}*/}
					</Spin>
				</Card>
			</>
		);
	}
}
