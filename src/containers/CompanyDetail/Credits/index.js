import React, { PureComponent } from 'react';
import AuthStorage from 'src/utils/AuthStorage';

import injectSheet from 'react-jss';
import styles from '../styles';
import { Layout, Typography, Row, Col, Switch, Icon, Button, message, Modal } from 'antd';
const { Text, Title } = Typography;
const { confirm } = Modal;

import Credit from './Credit/index';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateCompanieInfo, getCompanieInfo } from 'src/redux/actions/companies';
import { updateUserInfor } from 'src/redux/actions/user';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const mapStateToProps = state => ({
	detail: state.companies.detail.data
});

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			updateUserInfor,
			getCompanieInfo
		},
		dispatch
	)
});

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
export default class Credits extends PureComponent {
	state = {
		isShow: false
	};

	getDetails = () => {
		this.props.action.getCompanieInfo(
			{ id: this.props.id },
			() => this.setState({ loading: false }),
			() => this.setState({ loading: false })
		);
	};

	componentDidMount() {
		this.getDetails();
	}

	// handleEmailChange() {
	// 	alert('Email has changed');
	// 	this.setState({ isEdit: false });
	// }
    //
	// confirmActivate = () => {
	// 	const { detail } = this.props;
	// 	const { user, name } = detail;
	// 	const { creditActivated } = user;
	// 	const self = this;
	// 	confirm({
	// 		content: creditActivated ? `société désactivée ${name}` : `société activée ${name}`,
	// 		onOk() {
	// 			self.handleActivated();
	// 		},
	// 		onCancel() {}
	// 	});
	// };

	render() {
		const { classes, detail } = this.props;
		// const user = detail && detail.user;

		return (
			<div className={classes.subContainer}>
                <Row type="flex" justify="space-between" align="top">
					<Col>
						<Title level={4}>
							<FormattedMessage id="employee.creditAffection" defaultMessage="Credit affection" />
						</Title>
					</Col>
					<Col>
                        <SampleButton
                            name="Exporter"
                            type="link"
                            icon="download"
                            action={() => console.log(1)}
                        />
					</Col>
				</Row>
				{Object.getOwnPropertyNames(detail).length !== 0 && (
					<Credit details={detail} handleGetCompanyDetail={this.getDetails} />
				)}
			</div>
		);
	}
}
