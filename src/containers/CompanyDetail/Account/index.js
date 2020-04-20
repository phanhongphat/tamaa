import React, { PureComponent } from 'react';
import AuthStorage from 'src/utils/AuthStorage';

import injectSheet from 'react-jss';
import styles from '../styles';

import { Layout, Typography, Row, Col, Switch, message, Modal } from 'antd';
const { Title, Text } = Typography;
const { confirm } = Modal;

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateCompanieInfo } from 'src/redux/actions/companies';
import { updateUserInfor } from 'src/redux/actions/user';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import ActiveAccount from './ActiveAccount';

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			updateUserInfor
		},
		dispatch
	)
});

@connect(
	null,
	mapDispatchToProps
)
@injectSheet(styles)
export default class Account extends PureComponent {
	state = {
		isShow: false
	};

	handleActivated() {
		const _id = this.props.details.id;
		const { creditActivated, activated, id } = this.props.details.user;

		const payload = {
			id,
			activated: !activated,
			creditActivated: !activated
		};
		this.props.action.updateUserInfor(
			payload,
			() => {
				this.setState({ loading: false });
				message.success(!activated ? 'Activé' : 'Deactivé');
				this.props.handleGetCompanyDetail(_id);
			},
			() => this.setState({ loading: false })
		);
	}

	confirmActivate() {
		const { details } = this.props;
		const { user, name } = details;
		const { activated } = user;
		const self = this;
		confirm({
			content: activated ? `Deactivé sociétés ${name}?` : `Activé sociétés ${name}?`,
			onOk() {
				self.handleActivated();
			},
			onCancel() {}
		});
	}

	render() {
		const { classes, handleGetCompanyDetail } = this.props;
		const { email, id, name, user } = this.props.details;
		const { activated, creditActivated } = user || true;
		const { isCompany } = AuthStorage;

		return (
			<Layout className={classes.subContainer}>
				<Row>
					<Col span={5}>
						<Title level={4}>
							<FormattedMessage id="employee.accountStatus" defaultMessage="Account status" />
						</Title>
					</Col>
					<Row style={{ float: 'right', visibility: isCompany ? 'hidden' : 'visible' }}>
						<Col span={12}>
							<Switch
								onChange={() => this.confirmActivate()}
								// disabled={creditActivated ? true : false}
								style={{ width: '50px' }}
								checked={activated ? true : false}
							/>
						</Col>
						<Col span={5} push={2}>
							<Text strong>
								{activated ? (
									<FormattedMessage id="activated" defaultMessage="Activated" />
								) : (
									<FormattedMessage id="deactivated" defaultMessage="Deactivated" />
								)}
							</Text>
						</Col>
					</Row>
				</Row>
				<ActiveAccount
					customId={user.customId}
					id={id}
					companyName={name}
					email={email}
					reload={handleGetCompanyDetail}
				/>
			</Layout>
		);
	}
}
