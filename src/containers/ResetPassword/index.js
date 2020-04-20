import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Row, Col, Modal } from 'antd';
import { Link, Router } from 'src/routes';

import AuthStorage from 'src/utils/AuthStorage';
import UserLayout from 'src/layout/UserLayout';
import ResetPassword from 'src/components/Form/ResetPassword';

import styles from './styles';

//redux
import { verifyCaTokenRequest } from 'src/redux/actions/auth';

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
				verifyCaTokenRequest
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
@injectSheet(styles)
export default class ResetPasswordContainer extends PureComponent {
	state = {
		token: ''
	};

	componentDidMount() {
		const { token } = this.props;
		if (AuthStorage.loggedIn) {
			Router.pushRoute('/');
		} else {
			if (token) {
				this.handelCheckToken(token);
			}
		}
	}

	handelCheckToken = token => {
		const payload = {
			params: {
				token
			}
		};
		this.props.action.verifyCaTokenRequest(
			payload,
			res => {
				if (res.statusCode && res.statusCode === 401) {
					Modal.error({
						title: res.message,
						onOk() {
							Router.pushRoute('/');
						}
					});
				}
				if (res.status && res.status === 'success') {
					const { token, roles = '' } = res;
					this.setState({ token, roles });
				}
			},
			() => {}
		);
	};

	render() {
		const { classes } = this.props;
		const { token, roles } = this.state;
		return (
			<UserLayout>
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
										<div>
											A strong password is combination of letters and punctuation. It must be
											between 8 - 12 characters long.
										</div>
										<ResetPassword token={token} roles={roles} />
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
