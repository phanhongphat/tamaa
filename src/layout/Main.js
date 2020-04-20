import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Modal } from 'antd';

import SiderLayout from 'src/components/Layout/Sider';
import Header from 'src/components/Layout/Header';
import EmployeesLayout from 'src/layout/Employees';
import AuthStorage from 'src/utils/AuthStorage';

const { Content } = Layout;

// let time = false;
let setTime;

const onMouseMove = () => {
	if (AuthStorage.loggedIn) {
		clearTimeout(setTime);
		setTime = setTimeout(() => {
			AuthStorage.destroy();
			Modal.error({
				title: 'Session has timed out',
				content: (
					<div>
						<p>Your session has timed out. Please login again</p>
					</div>
				),
				onOk() {
					window.location.reload();
				}
			});
		}, 1800000);
		// }, 5000);
	}
};

const MainLayout = props => {
	const { children } = props;

	// if (window) {
	onMouseMove();
	// }
	return (
		<Layout style={{ minHeight: '100vh' }} onMouseDown={() => onMouseMove()}>
			<SiderLayout />
			<Layout style={{ paddingLeft: '200px' }}>
				<Header style={{ background: '#fff', padding: 0 }} />
				{/* <Breadcrumb /> */}
				<Content style={{ margin: '0 16px', paddingTop: '64px' }}>
					<EmployeesLayout>{children}</EmployeesLayout>
				</Content>
				{/* <Footer style={{ textAlign: 'center' }}> ©2019 Created by Kyanon Digital</Footer> */}
			</Layout>
		</Layout>
	);
};

MainLayout.prototype = {
	children: PropTypes.node.isRequired
};

MainLayout.defaultProps = {};

export default MainLayout;
