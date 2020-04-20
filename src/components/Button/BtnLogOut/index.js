import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Router } from 'src/routes';
import styles from './styles';

import { logoutRequest } from 'src/redux/actions/auth';

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
				logoutRequest
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
export default class BtnLogOut extends PureComponent {
	handleLogOut = e => {
		this.props.action.logoutRequest(() => {
			Router.pushRoute('/login');
		});
	};

	render() {
		return (
			<Button type="link" onClick={this.handleLogOut} style={{width: '100%', textAlign: 'left'}}>
				Logout
			</Button>
		);
	}
}
