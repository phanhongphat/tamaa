import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectSheet from 'react-jss';
import { Icon, Card, Menu, Dropdown, message, Tag, Tabs, Divider, Row, Col } from 'antd';

import Breadcrumb from 'src/components/Breadcrumb';
import EmployeeDetail from 'src/containers/EmployeeDetails/Detail/index.js';
import EmployeeCredits from 'src/containers/EmployeeDetails/Credits';
import EmployeeAccount from 'src/containers/EmployeeDetails/Account';
import EmployeeTransactions from 'src/containers/EmployeeDetails/Transactions';
import { getEmployeeDetails, editEmployeeRequest } from 'src/redux/actions/employee';
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
export default class TabsPanel extends PureComponent {
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

	render() {
		const { classes } = this.props;
		return (
			<Row type="flex" justify="space-between">
				<Col span={24}>
					<Row className={classes.tabs}>
						<Tabs defaultActiveKey="1">
							<TabPane tab={<FormattedMessage id="details" defaultMessage="Details" />} key="1">
								<EmployeeDetail user={this.props.user} />
							</TabPane>
							<TabPane tab={<FormattedMessage id="nav.credits" defaultMessage="Credits" />} key="2">
								<EmployeeCredits
									user={this.props.user}
									handelGetEmployeeDetail={this.props.handelGetEmployeeDetail}
								/>
							</TabPane>
							<TabPane tab="Transactions" key="3">
								<EmployeeTransactions user={this.props.user} />
							</TabPane>
							<TabPane tab={<FormattedMessage id="account" defaultMessage="Account" />} key="4">
								<EmployeeAccount
									user={this.props.user}
									handelGetEmployeeDetail={this.props.handelGetEmployeeDetail}
								/>
							</TabPane>
						</Tabs>
					</Row>
				</Col>
			</Row>
		);
	}
}
