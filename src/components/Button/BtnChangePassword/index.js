import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import Link from 'next/link';
import { Modal, Button } from 'antd';

import ChangePasswordForm from 'src/components/Form/ChangePassword';

import styles from './styles';

@injectSheet(styles)
export default class BtnChangePassword extends PureComponent {
	state = {
		visible: false
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = e => {
		this.setState({
			visible: false
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false
		});
	};

	render() {
		const { classes } = this.props;

		return (
			<>
				<Button type="link" onClick={this.showModal}>
					Changer de mot de passe
				</Button>
				<Modal
					title="Changer de mot de passe"
					visible={this.state.visible}
					footer={null}
					onOk={this.handleOk}
					destroyOnClose
					onCancel={this.handleCancel}>
					<div>
						<p>
							Un mot de passe fort est une combinaison de lettres et de signes de ponctuation. Il doit
							comprendre au moins 8 à 12 caractères.
						</p>
						<ChangePasswordForm handleCancel={this.handleCancel} />
					</div>
				</Modal>
			</>
		);
	}
}
