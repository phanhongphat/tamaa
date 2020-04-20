import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router } from 'routes';

import AuthStorage from 'src/utils/AuthStorage';

function mapStateToProps(state) {
	return {
		store: {
			auth: state.auth
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {};
};

@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class AuthWrrap extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		store: PropTypes.shape({
			auth: PropTypes.object.isRequired
		})
	};

	static defaultProps = {};

	componentDidMount() {
		const {
			store: { auth }
		} = this.props;

		if (AuthStorage.role === 'ROLE_COMPANY') {
			Router.pushRoute('/');
		}
	}

	render() {
		const {
			children,
			store: { auth }
		} = this.props;

		if (AuthStorage.role === 'ROLE_COMPANY') {
			return null;
		}
		return children;
	}
}
