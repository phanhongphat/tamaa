import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Menu, Dropdown, Button } from 'antd';

import { Router } from 'src/routes';
import AuthStorage from 'src/utils/AuthStorage';

// import NoticeIcon from 'src/components/NoticeIcon';
import Avartar from 'src/components/Avartar';
import BtnLogOut from 'src/components/Button/BtnLogOut';
import BtnChangePassword from 'src/components/Button/BtnChangePassword';
import BtnLanguage from 'src/components/Button/Language';

import styles from './styles';

@injectSheet(styles)
export default class RightHeader extends PureComponent {
	state = {
		visible: false
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	render() {
		const { classes } = this.props;
		const { visible } = this.state;
		const { isTama, isCompany, isRestaurant, isEmployee, idInfo, email } = AuthStorage;

		const menu = (
			<Menu>
				{isCompany && (
					<Menu.Item onClick={() => Router.pushRoute(`/company-detail/${idInfo}`)}>
						<Button type="link" >
							<a>My Company</a>
						</Button>
					</Menu.Item>
				)}

				{isRestaurant && (
					<Menu.Item onClick={() => Router.pushRoute(`/restaurants-detail/${idInfo}`)}>
						<Button type="link" >
							<a>My Restaurant</a>
						</Button>
					</Menu.Item>
				)}

				<Menu.Item>
					<BtnChangePassword />
				</Menu.Item>
				<Menu.Item>
					<BtnLogOut />
				</Menu.Item>
			</Menu>
		);

		return (
			<>
				<div className={classes.container}>
					<div className={classes.avatar}>
						<Dropdown overlay={menu}>
							<a className="ant-dropdown-link" href="#">
								<Avartar name={email} />
							</a>
						</Dropdown>
					</div>
					<div>
						<BtnLanguage />
					</div>
				</div>
			</>
		);
	}
}
