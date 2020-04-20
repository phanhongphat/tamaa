import React, { PureComponent } from 'react';
import AuthStorage from 'src/utils/AuthStorage';

import { Row, Col, message, Typography, Button, Modal } from 'antd';

import EmailSendModal from './EmailSendModal';
import Edit from 'src/components/Input/Edit';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import { updateCompanieInfo } from 'src/redux/actions/companies';
import { resetPassword } from 'src/redux/actions/resetPassword';

const { confirm } = Modal;

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			resetPassword
		},
		dispatch
	)
});

const { Text } = Typography;

@connect(
	null,
	mapDispatchToProps
)
export default class ActiveAccount extends PureComponent {
	state = {
		email: '',
		resetPwd: false,
		isShow: false,
		confirmLoading: false
	};

	onChange(e) {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.setState({ [name]: value });
	}

	handleCompanyUpdate = (name, value) => {
		const { id } = this.props;
		const payload = {
			id,
			[name]: value
		};
		this.props.action.updateCompanieInfo(
			payload,
			() => {
				this.setState({ loading: false });
				if (typeof handleCancel === 'function') handleCancel();
				message.success('Update company name success');
				this.props.reload(id);
			},
			() => this.setState({ loading: false })
		);
	};

	handleConfirm = boolean => {
		this.setState({
			confirmLoading: true
		});
		const payload = { email: this.props.email };
		this.props.action.resetPassword(
			payload,
			() => this.setState({ loading: false, confirmLoading: false }),
			() => this.setState({ loading: false, confirmLoading: false })
		);
		this.toggleVisible(boolean);
	};

	toggleVisible = boolean => {
		this.setState({ resetPwd: boolean, isShow: false });
	};

	render() {
		const { email } = this.props;
		const { isCompany, isTama } = AuthStorage;

		return (
			<div>
				<Row style={{ background: 'white' }}>
					<Col span={3} style={{ marginTop: '5px' }}>
						<Text strong>Email</Text>
					</Col>
					<Col span={10}>
						<Edit
							value={email || ''}
							name="email"
							onChange={this.onChange}
							handleSave={this.handleCompanyUpdate}
						/>
					</Col>
				</Row>
				{isTama && (
					<Row style={{ marginTop: '10px' }}>
						<Button
							type="danger"
							icon={this.state.confirmLoading ? 'loading' : ''}
							disabled={this.state.confirmLoading}
							// onClick={() => this.setState({ isShow: true })}
							onClick={() =>
								confirm({
									title: 'Confirmer',
									content: `tes-vous sûr de vouloir réinitialiser le mot de passe de la société #${this.props.customId}?`,
									onOk: () => this.handleConfirm(true),
									okText: 'Sauvegarder',
									onCancel() {},
									cancelText: 'Annuler'
								})
							}>
							{/* //TODO: Need to change this message to company */}
							Réinitialiser le mot de passe
							{/* <FormattedMessage id="company.account.resetPassword" defaultMessage="Reset password" /> */}
						</Button>
					</Row>
				)}

				<EmailSendModal
					visible={this.state.resetPwd}
					toggleVisible={this.toggleVisible}
					handleConfirm={this.handleConfirm}
				/>
			</div>
		);
	}
}
