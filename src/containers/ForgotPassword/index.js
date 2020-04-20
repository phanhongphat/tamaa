import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Row, Col, Modal, Button } from 'antd';
import { Link } from 'routes';

import UserLayout from 'src/layout/UserLayout';
import ForgotPasswordFrom from 'src/components/Form/ForgotPassword';

import styles from './styles';

//redux
import { forgotPasswordRequest } from 'src/redux/actions/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			auth: state.auth
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				forgotPasswordRequest
			},
			dispatch
		)
	};
};

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
export default class ForgotPasswordContainer extends PureComponent {
	state = {
		visible: false,
		email: ''
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	setEmailToForm = email => {
		this.setState({ email });
	};

	handleCancel = e => {
		this.setState({
			visible: false
		});
	};

	render() {
		const { classes } = this.props;
		return (
			<UserLayout>
				<Modal visible={this.state.visible} footer={null} closable onCancel={this.handleCancel}>
					<p>
						<strong>L'email a bien été envoyé.</strong>
					</p>
					<p>Un lien de réinitialisation de votre mot de passe vous ont été envoyés par e-mail. </p>
					<p>Merci de suivre les instructions envoyées par email pour réinitialiser votre mot de passe.</p>
					<p>Email non reçu ?</p>
					<Button type="link" onClick={this.handleCancel}>
						Renvoyer l'email d'authentification
					</Button>
				</Modal>

				<div className={classes.warp}>
					<Row>
						<Col md={9} xs={24}>
							<div className={classes.wrapRight}>
								<div className={classes.contentRight}>
									<div className={classes.topRight}>
										<div className={classes.wrapLogo}>
											<Link to="/">
												<img src="/static/assets/images/logo/logo.png" />
											</Link>
										</div>
									</div>
									<div className={classes.midRight}>
										<h3>Bienvenue sur Pass Tama'a</h3>
									</div>
									<div className={classes.bottomRight}>
										<div>© 2019 PASS TAMA'A</div>
										{/* <div className={classes.menu}>
										<Link to="/">Privacy</Link>
										<Link to="/apps">Legal</Link>
										<Link to="/apps">Contact</Link>
									</div> */}
									</div>
								</div>
							</div>
						</Col>
						<Col md={15} xs={24}>
							<div className={classes.wrapLeft}>
								<div className={classes.leftHead}>
									<span />
								</div>
								<div className={classes.leftBody}>
									<div className={classes.form}>
										<ForgotPasswordFrom />
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</UserLayout>
		);
	}
}
