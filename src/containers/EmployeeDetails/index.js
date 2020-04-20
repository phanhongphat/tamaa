import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectSheet from 'react-jss';
import { Icon, Card, Menu, Dropdown, message, Tag, Tabs, Divider, Row, Col } from 'antd';

import Breadcrumb from 'src/components/Breadcrumb';
import { getEmployeeDetails, editEmployeeRequest } from 'src/redux/actions/employee';
import TabsPanel from './Tabs.js';
import styles from './styles';
import FieldEditor from './CustomFieldEdit';
import FieldFullNameEditor from 'src/components/Input/FullNameInputEditor';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const { TabPane } = Tabs;
function mapStateToProps(state) {
	return {
		store: {
			user: state.employees.detail
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getEmployeeDetails,
				editEmployeeRequest
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
export default class EmployeeContainer extends PureComponent {
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
		visible: false,
		isClickEdit: false,
		value: '',
		valueFirstName: '',
		isClickEditAddress: false,
		idCompany: 0
	};

	handleEditChange = field => {
		const { id } = this.props.store.user.data;
		const payload = {
			id,
			[field]: this.state.value
		};

		this.props.action.editEmployeeRequest(
			payload,
			() => {
				this.setState({
					loading: false,
					isClickEdit: false
				});
			},
			() => {
				this.setState({
					loading: false
				});
			}
		);
	};
	handleEdit = () => {
		this.setState({
			isClickEdit: true
		});
	};
	handleSave = () => {
		this.setState({
			isClickEdit: false
		});
	};
	handleCancel = () => {
		this.setState({
			isClickEdit: false
		});
	};

	componentDidMount() {
		this.handelGetEmployeeDetail();
	}

	handelGetEmployeeDetail = () => {
		const { id } = this.props;
		const payload = {
			id
		};

		this.props.action.getEmployeeDetails(
			payload,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

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
	getIdCompanyDetal = id => {
		this.setState({ idCompany: id });
	};

	render() {
		const {
			classes,
			id,
			store: { user = {} }
		} = this.props;

		const { data } = user;
		const width1 = '65%';
		const width2 = '100%';
		const width = !this.state.isClickEdit ? width1 : width2;
		const fullName = data.firstName ? data.firstName + ' ' + data.lastName : '';

		const routes = [
			{
				path: '/employees',
				breadcrumbName: <FormattedMessage id="employees.name" defaultMessage="Employees" />
			},
			{
				breadcrumbName: fullName
			}
		];

		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					//  title="ss"
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					{data && data.user && data.user.customId && (
						<div>
                            <Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
                                <Col>
                                    <Row type="flex" align="middle">
                                        <h3>
                                            <strong>
                                                {data.lastName ? data.lastName + ' ' + data.firstName : ''}
                                                <Divider type="vertical" />#{data.user.customId}
                                            </strong>
                                        </h3>
                                    </Row>
                                </Col>
                            </Row>
							<TabsPanel user={user} handelGetEmployeeDetail={this.handelGetEmployeeDetail} />
						</div>
					)}
				</Card>
			</>
		);
	}
}
