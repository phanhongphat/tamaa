import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
export default class DisplayTime extends PureComponent {
	render() {
		const { condition } = this.props;
		console.log(condition);
		return (
			<>
				{condition.map(
					(d, index) =>
						d &&
						d !== null &&
						d !== undefined && (
							<Row type="flex" align="middle" key={index} gutter={5} style={{ marginTop: '1px' }}>
								{d === '00:00-00:00' ? (
									<Col>Fermer</Col>
								) : (
									// <Col span={10}>{d}</Col>
									<div>
										<Col span={12}>{d.slice(0, 5)}</Col>
										<Col span={6}>&mdash;</Col>
										<Col span={6}>{d.slice(-5)}</Col>
									</div>
								)}
							</Row>
						)
				)}
			</>
		);
	}
}
