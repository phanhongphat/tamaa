import React, { PureComponent } from 'react';

import { Card, Row, Col, Typography } from 'antd';
import CONSTANTS from 'src/constants';
import styles from '../../styles';
import injectSheet from 'react-jss';

const { Text } = Typography;

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class BalanceCard extends PureComponent {
    render() {
        const { classes, balance, name } = this.props;
        return (
            <Card style={{ boxShadow: '2px 2px 10px lightgrey', marginBottom: '10px' }}>
                <Row type="flex" align="middle" justify="space-between">
                    <Col>
                        <Text strong>{name}</Text>
                    </Col>
                    <Col>
                        <Row className={classes.wrapper_currentBalance} justify="end">
                            <Text className={classes.creditTag}>
                                {balance ? numberWithSpaces(balance) : 0}
                                <span style={{ fontSize: '12px', padding: '0 10px' }}>
                                    {CONSTANTS.CURRENCY}
                                </span>
                            </Text>
                        </Row>
                    </Col>
                </Row>
            </Card>
        );
    }
}
