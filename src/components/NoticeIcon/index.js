import React from 'react';
import { Tooltip, AvatarIcon, Icon, Popover, Badge } from 'antd';
// import classNames from 'classNames';

export default class NoticeIcon extends React.PureComponent {
	state = {
		visible: false
	};

	hiden = () => {
		this.setState({
			visible: true
		});
	};

	handlevisibleChange = visible => {
		this.setState({ visible });
	};

	render() {
		const { bell, count, size, onClick = () => {} } = this.props;
		const NoticeBellIcon = bell || (
			<Badge dot>
				<Icon type="bell" className="" />
			</Badge>
		);
		return (
			<Popover
				content={NoticeBellIcon}
				trigger="click"
				visible={this.state.visible}
				onVisibleChange={this.handlevisibleChange}>
				{NoticeBellIcon}
			</Popover>
		);
	}
}
