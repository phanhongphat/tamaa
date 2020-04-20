import React, { PureComponent } from 'react';
import cookie from 'react-cookies';
import { Menu, Dropdown, Icon, Button } from 'antd';

class BtnLanguage extends PureComponent {
	state = {
		locale: null
	};

	changeLocale = value => {
		const locale = cookie.load('_lang') || 'FR';
		if (value !== locale) {
			cookie.save('_lang', value);
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	};

	render() {
		const locale = cookie.load('_lang') || 'FR';
		const menu = (
			<Menu defaultSelectedKeys={[locale]}>
				<Menu.Item key="EN">
					<Button type="link" onClick={() => this.changeLocale('EN')} style={{ minWidth: '50px' }}>
						EN
					</Button>
				</Menu.Item>
				<Menu.Item key="FR">
					<Button type="link" onClick={() => this.changeLocale('FR')}>
						FR
					</Button>
				</Menu.Item>
			</Menu>
		);

		return (
			<Dropdown overlay={menu} trigger={['click']}>
				<Button type="link">
					<Icon type="global" />
				</Button>
			</Dropdown>
		);
	}
}

export default BtnLanguage;
