import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, DatePicker, Row, Col } from 'antd';
import styles from './styles';

const { Text } = Typography;

@injectSheet(styles)
@Form.create()
export default class FieldAddressEditor extends PureComponent {
	state = {
		loading: true,
		editEnable: false,
		fieldInfo: {
			name: 'defaultValue',
			value: 'defaultValue',
			editEnable: false
		},
		buttonTextEdit: 'Edit',
		buttonTextSave: 'Save',
		buttonTextCancel: 'Cancel',
		inputWidth: '200px'
	};

    onChangeDate = value => {
		this.props.onChange(value);
    };
    
	render() {
        const { name, value, classes } = this.props;
		return (
			<Row>
				{(this.state.editEnable || this.props.isClickEditAddress) ? (
					<Input.Group compact className={classes.inputGroup}>
						<Row className={classes.inputRow__rowInput}>
                            <Col span={8}>
                                <Input
                                    name={name}
                                    defaultValue={value}
                                    style={{ width: this.state.inputWidth }}
                                    onChange={e => {
                                        console.log(e.target.value);
                                        this.props.onChange(e.target.value);
                                    }}
                                />
                            </Col>
                        </Row>
					</Input.Group>
				) : (
					<Input.Group compact className={classes.inputGroup}>
						<Row className={classes.inputGroup__rowTextEdit}>
                            <Col className={classes.rowTextEdit__text} span={20}><Text>{value}</Text></Col>
							{/* <Col span={1} offset={1}>
								<Button
									type="link"
									onClick={() => {
										this.setState({
											editEnable: true
										});
										console.log('Edit', this.state.fieldInfo);
									}}>
									{this.state.buttonTextEdit}
								</Button>
							</Col> */}
						</Row>
					</Input.Group>
				)}
			</Row>
		);
	}
}
