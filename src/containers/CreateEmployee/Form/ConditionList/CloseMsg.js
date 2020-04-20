import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

export default class CloseMsg extends PureComponent {
	render() {
		return (
			<Row>
				<Col span={12}>
					<Text>Fermer</Text>
				</Col>
			</Row>
		);
	}
}
