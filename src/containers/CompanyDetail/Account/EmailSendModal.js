import React from 'react';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import { Modal, Row, Col, Typography, Button, Icon } from 'antd';

const { Text, Title } = Typography;

function EmailSendModal(props) {
	return (
		<Modal
			visible={props.visible}
			onCancel={() => props.toggleVisible(false)}
			footer={
				<div style={{ textAlign: 'left', padding: '0 8px' }}>
					<div>
						<FormattedMessage id="notReceiveEmail" defaultMessage="Can not find the email?" />
					</div>
					<Button
						type="link"
						style={{ padding: 0 }}
						// icon="sync"
						onClick={() => props.handleConfirm()}>
						<FormattedMessage id="resendEmail" defaultMessage="Resend authentication email" />
					</Button>
				</div>
			}>
			<Title level={4}>
				<FormattedMessage id="sentEmail" defaultMessage="Email has been sent" />
			</Title>
			<div>
				<FormattedMessage
					id="announceSentEmail"
					defaultMessage="Email to reset password has been send to your account"
				/>
			</div>
			<div>
				<FormattedMessage
					id="structureResetEmail"
					defaultMessage="Please follow the instruction in the email to reset your password. If you do not receive the email, check your spam box"
				/>
			</div>
			{/*<Button*/}
			{/*    type="link"*/}
			{/*    style={{ padding: 0 }}*/}
			{/*    onClick={() => props.handleConfirm()}>*/}
			{/*    <FormattedMessage*/}
			{/*        id="resendEmail"*/}
			{/*        defaultMessage="Resend authentication email"/>*/}
			{/*</Button>*/}
		</Modal>
	);
}
export default EmailSendModal;
