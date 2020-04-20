import React, { PureComponent } from 'react';

import { Form, Icon, DatePicker, Checkbox, Row, Col, TimePicker } from 'antd';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

// const { TimePicker } = DatePicker;
const formItemLayoutWithOutLabel = {
	wrapperCol: {
		xs: { span: 24, offset: 0 },
		sm: { span: 20, offset: 4 }
	}
};
const timeFormat = 'HH:mm';

export default class DateSelected extends PureComponent {
	render() {
		return (
			<div>
				<Checkbox.Group width="100%">
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="mondays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('mondays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="mondays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="close"
											onClick={() => this.remove('mondays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="mondays" name="mondays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="monday" defaultMessage="Monday" /></span>
						</Col>
					</Row>
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="tuedays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('tuedays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="tuedays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="close"
											onClick={() => this.remove('tuedays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="tuedays" name="tuedays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="tuesday" defaultMessage="Tuesday" /></span>
						</Col>
					</Row>
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="webnesdays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('webnesdays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="webnesdays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="close"
											onClick={() => this.remove('webnesdays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="webnesdays" name="webnesdays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="wednesday" defaultMessage="Wednesday" /></span>
						</Col>
					</Row>
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="thurdays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('thurdays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="thurdays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="close"
											onClick={() => this.remove('thurdays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="thurdays" name="thurdays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="thursday" defaultMessage="Thursday" /></span>
						</Col>
					</Row>
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="fridays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('fridays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="fridays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="close"
											onClick={() => this.remove('fridays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="fridays" name="fridays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="friday" defaultMessage="Friday" /></span>
						</Col>
					</Row>
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="saturdays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('saturdays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="saturdays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.remove('saturdays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="saturdays" name="saturdays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="saturday" defaultMessage="Saturday" /></span>
						</Col>
					</Row>
					<Row>
						<Col span={18} push={6}>
							<Form.Item {...formItemLayoutWithOutLabel}>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="sundays-1">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="plus"
											onClick={() => this.add('sundays')}
										/>
									</div>
								</div>
								<div style={{ display: 'flex', flexDirection: 'row' }} id="sundays-2">
									<div name="start">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }}><FormattedMessage id="to" defaultMessage="to" /></div>
									<div name="end">
										<TimePicker format={timeFormat} />
									</div>
									<div style={{ paddingRight: '16px', paddingLeft: '16px' }} name="icon">
										<Icon
											className="dynamic-delete-button"
											type="close"
											onClick={() => this.remove('sundays')}
										/>
									</div>
								</div>
							</Form.Item>
						</Col>
						<Col span={6} pull={18} style={{ marginTop: '8px' }}>
							<Checkbox value="sundays" name="sundays" />
							<span style={{ paddingRight: '8px', paddingLeft: 'px' }}><FormattedMessage id="sunday" defaultMessage="Sunday" /></span>
						</Col>
					</Row>
				</Checkbox.Group>
			</div>
		);
	}
}
