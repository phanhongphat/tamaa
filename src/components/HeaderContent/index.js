import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import { Form, Icon, Menu, Dropdown, Button, Divider, Typography, Row, Col } from 'antd';

import styles from './styles';
const { Text } = Typography;
@injectSheet(styles)
export default class HeaderContent extends PureComponent {
	static propTypes = {};

	static defaultProps = {};

	state = {};

	renderBtn = button => {
		return (
			<Button
				type="primary"
				href={button.href}
				htmlType={button.type}
				style={button.styleCss}
				onClick={button.onClick}>
				{button.name}
			</Button>
		);
	};
	renderOption = option => {
		return (
			<Menu>
				{option.map(item => (
					<Menu.Item key="restaurant-more-deactive">
						<Button type="link" onClick={item.onClick}>
							<Icon type={item.icon} /> &nbsp; {item.name}
						</Button>
					</Menu.Item>
				))}
			</Menu>
		);
	};

	render() {
		const { option, button, icon, classes } = this.props;
		const optionList = option && option.length > 0 ? this.renderOption(option) : <></>;
		return (
			<Row className={classes.wrapper} type="flex" align="middle">
				<Col className={classes.nameId}>
					{this.props.name && this.props.name.length > 0 && (
						<h3>
							<strong>{this.props.name}</strong>
						</h3>
					)}

					{/* <Divider type="vertical" /> */}
					{this.props.id && this.props.id.length > 0 && (
						<div className={classes.wrapperId}>
							<Divider type="vertical" />
							<h3>
								<strong>{this.props.id}</strong>
							</h3>
						</div>
					)}
				</Col>

				<Col className={classes.wrapper__btnIcon}>
					{button && <Form.Item>{this.renderBtn(button)}</Form.Item>}
					{option && option.length > 0 && (
						<Dropdown overlay={optionList} placement="bottomRight" trigger={['click']}>
							<Icon type={icon.name} style={icon.style} />
						</Dropdown>
					)}
				</Col>
			</Row>
		);
	}
}
