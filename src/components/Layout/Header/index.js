import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Layout, Typography } from 'antd';

import AuthStorage from 'src/utils/AuthStorage';
import RightHeader from 'src/components/Layout/Header/RightHeader';

const { Header } = Layout;
const { Text } = Typography;

import styles from './styles';
@injectSheet(styles)
export default class HeaderLayout extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Header className={classes.header}>
				<div style={{ marginLeft: '15px', display: 'inline-block' }}>
					<Text strong>{`Hi ${AuthStorage.nameUser || 'Admin'} !`}</Text>
				</div>
				<div className={classes.right}>
					<RightHeader />
				</div>
			</Header>
		);
	}
}

// HeaderLayout.propTypes = {};

// export default HeaderLayout;
