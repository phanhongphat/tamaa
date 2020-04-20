import React, { PureComponent } from 'react';

import { Button, Menu } from 'antd';

export const _HeaderText = props => (
	<h3>
		<strong>{props.name}</strong>
	</h3>
);

export default class SampleButton extends PureComponent {
	handleClick = () => {
		this.props.action();
	};
	render() {
		const { name, type, icon, loading, htmlSubmit, disabled } = this.props;
		return (
			<Button
				disabled={disabled}
				htmlType={htmlSubmit}
				loading={loading}
				icon={icon}
				type={type}
				onClick={htmlSubmit ? null : this.handleClick}>
				{name}
			</Button>
		);
	}
}

/*
	<SampleButton name=""
		htmlSubmit=""
		action={}
		type=""
		icon=""
		disabled={true | false}
	/>
	Ajouter une société
*/
