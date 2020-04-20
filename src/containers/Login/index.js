import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Row, Col } from 'antd';
import { Link } from 'routes';

import UserLayout from 'src/layout/UserLayout';
import LoginFrom from 'src/components/Form/Login';
import AuthStorage from 'src/utils/AuthStorage';
import { Router } from 'src/routes';

import styles from './styles';

@injectSheet(styles)
export default class LoginContainer extends PureComponent {
	componentDidMount() {
		if (AuthStorage.loggedIn) {
			Router.pushRoute('/');
		}
	}

	render() {
		const { classes } = this.props;
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
										<LoginFrom />
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
