import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { FormattedMessage } from 'react-intl';

import AuthStorage from 'src/utils/AuthStorage';
import styles from './styles';

const FormItem = Form.Item;

//redux,
import { createUserRequest } from 'src/redux/actions/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			user: state.user
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				createUserRequest
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
@Form.create()
export default class CreateUseFrom extends PureComponent {
	static propTypes = {
		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}).isRequired,
		action: PropTypes.shape({
			createUserRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		loading: false
	};

	// plainOptions = ['ROLE_EMPLOYEE', 'ROLE_RESTAURANT', 'ROLE_COMPANY', 'ROLE_TAMAA'];

	// plainOptions = [
	// 	{ label: 'Tama', value: 'Apple' },
	// 	{ label: 'Company', value: 'Pear' },
	// 	{ label: 'Employee', value: 'Orange' },
	// 	{ label: 'Restaurant', value: 'Orange' },
	//   ];

	// componentDidMount() {
	// 	if (AuthStorage.loggedIn && this.props.store.auth.id) {
	// 		Router.pushRoute('/');
	// 	}
	// }

	onChange = checkedValues => {
		// console.log('checked = ', checkedValues);
	};





	render() {
		// const intl = useIntl;
		const { loading } = this.state;
		const { classes } = this.props;
		const { getFieldDecorator, resetFields } = this.props.form;
		return (
            <div></div>
		);
	}
}
