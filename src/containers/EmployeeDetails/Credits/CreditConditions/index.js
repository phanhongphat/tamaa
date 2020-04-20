import React, { PureComponent } from "react"
import { Layout, Row, Col, Button, Input, TimePicker } from 'antd'

import styles from './styles'

const format = 'HH:mm'
export default class CreditConditions extends PureComponent {
    state = {
        isEdit: false
    }
    render() {
        const { isEdit } = this.state
        if (this.props.conditions !== undefined) {
            var { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = this.props.conditions
        }
        else var { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = {
            "monday": ["10:00-13:30"],
            "tuesday": ["10:00-13:30"],
            "wednessday": ["10:00-13:30"],
            "thursday": ["10:00-13:30"],
            "friday": ["10:00-13:30"],
            "saturday": ["10:00-13:30"],
            "sunday": ["10:00-13:30"],
        }
        // else console.log(this.props.conditions)
        return (
            <Layout style={styles.layout}>
                <Row style={styles.narrow}>
                    <Col span={4}>Credit conditions</Col>
                    <Col span={4}>Monday</Col>
                    <Col span={5}>
                        {(isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : monday && monday.map(day => <div>{day}</div>) || "Closed")}
                    </Col>
                    <Col span={4}>
                        {isEdit ? <div>
                            <Button onClick={() => {alert('Save?'), this.setState({isEdit: false})}}>Change</Button> {' '}
                            <Button onClick={() => this.setState({isEdit: false})}>Exit</Button>
                        </div> :
                            <Button type="link" onClick={() => this.setState({ isEdit: !this.state.isEdit })}>Edit</Button>
                        }
                    </Col>
                </Row>
                <Row style={styles.narrow}>
                    <Col span={4}></Col>
                    <Col span={4}>Tuesday</Col>
                    <Col span={4}>
                        {isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : tuesday && tuesday.map(day => <div>{day}</div>) || "Closed"}
                    </Col>
                </Row>
                <Row style={styles.narrow}>
                    <Col span={4}></Col>
                    <Col span={4}>Wednesday</Col>
                    <Col span={4}>
                        {isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : wednesday && wednesday.map(day => <div>{day}</div>) || "Closed"}
                    </Col>
                </Row>
                <Row style={styles.narrow}>
                    <Col span={4}></Col>
                    <Col span={4}>Thursday</Col>
                    <Col span={4}>
                        {isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : thursday && thursday.map(day => <div>{day}</div>) || "Closed"}
                    </Col>
                </Row>
                <Row style={styles.narrow}>
                    <Col span={4}></Col>
                    <Col span={4}>Friday</Col>
                    <Col span={4}>
                        {isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : friday && friday.map(day => <div>{day}</div>) || "Closed"}
                    </Col>
                </Row>
                <Row style={styles.narrow}>
                    <Col span={4}></Col>
                    <Col span={4}>Saturday</Col>
                    <Col span={4}>
                        {isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : saturday && saturday.map(day => <div>{day}</div>) || "Closed"}
                    </Col>
                </Row>
                <Row style={styles.narrow}>
                    <Col span={4}></Col>
                    <Col span={4}>Sunday</Col>
                    <Col span={4}>
                        {isEdit ? <div><TimePicker format={format}></TimePicker><TimePicker format={format}></TimePicker></div> : sunday && sunday.map(day => <div>{day}</div>) || "Closed"}
                    </Col>
                </Row>
            </Layout>
        )
    }
}
