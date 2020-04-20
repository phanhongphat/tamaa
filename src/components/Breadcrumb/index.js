import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Router } from 'src/routes';

import { Breadcrumb } from 'antd';

import styles from './styles';

const routes = [
	{
		path: 'index',
		breadcrumbName: 'home'
	},
	{
		path: 'first',
		breadcrumbName: 'first',
		children: [
			{
				path: '/general',
				breadcrumbName: 'General'
			},
			{
				path: '/layout',
				breadcrumbName: 'Layout'
			},
			{
				path: '/navigation',
				breadcrumbName: 'Navigation'
			}
		]
	},
	{
		path: 'second',
		breadcrumbName: 'second'
	}
];

@injectSheet(styles)
class BreadcrumbLayout extends PureComponent {
	render() {
		const { classes, breadcrumb = [], title = '' } = this.props;
		return (
			<div className={classes.wrap}>
				<Breadcrumb separator=">">
					{breadcrumb.map((e, index) => (
						<Breadcrumb.Item
							key={index}
							onClick={() => {
								e.path && e.path !== '' ? Router.pushRoute(e.path) : console.log('1');
							}}>
							<span style={e.path && e.path !== '' ? { cursor: 'pointer' } : null}>
								{e.breadcrumbName || ''}
							</span>
						</Breadcrumb.Item>
					))}
				</Breadcrumb>
				{title !== '' && (
					<div className={classes.heading}>
						<span>{title}</span>
					</div>
				)}
			</div>
		);
	}
}

export default BreadcrumbLayout;
