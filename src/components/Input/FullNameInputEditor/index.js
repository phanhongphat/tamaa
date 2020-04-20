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
export default class CustomFullNameFieldEditor extends PureComponent {
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
		inputWidth: '160px'
	};

    onChangeDate = value => {
		this.props.onChange(value);
    };
    
	render() {
        const { nameFirstName, nameLastName, valueFullName, valueFirstName, valueLastName, classes } = this.props;
		return (
			<Row>
				{this.state.editEnable ? (
					<Input.Group compact className={classes.inputGroup}>
						<Row className={classes.inputRow__rowInput}>
                            <Col span={6}>
                                <Input
                                    name={nameFirstName}
                                    defaultValue={valueFirstName}
                                    style={{ width: this.state.inputWidth }}
                                    onChange={e => {
                                        console.log(e.target.value);
                                        this.props.onChangeFirstName(e.target.value);
                                    }}
                                />
                            </Col>
                            <Col span={6}>
                                <Input
                                    name={nameLastName}
                                    defaultValue={valueLastName}
                                    style={{ width: this.state.inputWidth }}
                                    onChange={e => {
                                        console.log(e.target.value);
                                        this.props.onChangeLastName(e.target.value);
                                    }}
                                />
                            </Col>
                            <Col span={6} offset={6}>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.props.handleSaveFirstName();
                                        this.props.handleSaveLastName();
                                        this.setState({
                                            editEnable: false
                                        });
                                        console.log('Save', this.state.fieldInfo);
                                    }}>
                                    {this.state.buttonTextSave}
                                </Button>
                                <Button
                                    type="ghost"
                                    onClick={() => {
                                        this.setState({
                                            editEnable: false
                                        });
                                        console.log('Cancel', this.state.fieldInfo);
                                    }}>
                                    {this.state.buttonTextCancel}
                                </Button>
                            </Col>
                        </Row>
					</Input.Group>
				) : (
					<Input.Group compact className={classes.inputGroup}>
						<Row className={classes.inputGroup__rowTextEdit}>
                            <Col className={classes.rowTextEdit__textBolder} span={20}><Text>{valueFullName}</Text></Col>
							<Col span={1} offset={1}>
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
							</Col>
						</Row>
					</Input.Group>
				)}
			</Row>
		);
	}
}
